import { CompoundLayer, CustomLayer, EventArgs, FeatureInfo, FeatureProperties, RealEstateResponse, SuburbKey, WithFeatures } from '../../interfaces';
import { FiltersState, changePostCodes, selectFilters } from '../filters/filtersSlice';
import { GeoJSON, ZoomControl } from 'react-leaflet';
import { addFeature, highlightFeature, removeFeature, setFeatureColor, unhighlightFeature } from '../featureList/featureListSlice';
import { changePricesToColors, highlightLegendEntry, unhighlightLegendEntry } from '../legend/legendSlice';
import { clearInfo, setInfo } from '../info/infoSlice';
import { selectDistrictList } from '../districtList/districtListSlice';
import { useDispatch, useSelector } from 'react-redux';
import { usePromiseTracker } from 'react-promise-tracker';
import ColorUtils from '../../utils/colorUtils';
import Control from 'react-leaflet-control';
import CurrentLocation from '../currentLocation/CurrentLocation';
import FeatureList from '../featureList/FeatureList';
import Info from '../info/Info';
import L, { LatLngBounds, Map, StyleFunction } from 'leaflet';
import Legend from '../legend/Legend';
import Loader from 'react-loader-spinner';
import MoneyUtils from '../../utils/moneyUtils';
import PropTypes from 'prop-types';
import React, { Dispatch, useCallback, useEffect, useMemo } from 'react';
import ShowAll from '../showAll/ShowAll';
import StringUtils from '../../utils/stringUtils';
import fetchPolygonData from '../../backendRequests/polygonRetrieval';
import fetchPriceDataDebounced, { priceDataSearchPromiseTrackerArea } from '../../backendRequests/priceDataSearch';

interface FeatureMapProps {
  leafletMap: Map;
}

let mapElement: Map | undefined;
let bounds: LatLngBounds | undefined;
let geoJsonElement: GeoJSON;
let dispatch: Dispatch<unknown>;
let priceDataBySuburbId: { [suburbId: string]: RealEstateResponse } | undefined = undefined;
let suburbIdsByPriceInterval: { [price: number]: string[] } = {};
const currentlyCheckedDistricts: { [fileName: string]: undefined } = {};
const layersBySuburbId: { [suburbId: string]: CustomLayer } = {};
const layersByFileName: { [fileName: string]: CustomLayer[] } = {};

const colors = ColorUtils.generateColors(15);

const getSuburbId = (name: string, postCode: number) => StringUtils.removeNonAlphaNumberic(name).toLowerCase() + '_' + postCode;

const showAll = () => {
  if (bounds && mapElement && bounds.isValid()) {
    mapElement.fitBounds(bounds);
  }
};

const showLocation = (coords: Coordinates) => {
  mapElement?.setView([coords.latitude, coords.longitude], 11);
};

const zoomToFeatureOnMap = (layer: CustomLayer) => {
  mapElement?.fitBounds(layer.getBounds());
};

const zoomToFeatureById = (suburbId: string) => {
  const layer = layersBySuburbId[suburbId];
  layer && zoomToFeatureOnMap(layer);
};

const highlightFeatureOnMap = (layer: CustomLayer, scroll: boolean) => {
  layer.setStyle({
    weight: 3,
    color: 'black',
    //fillColor: 'magenta',
    dashArray: '',
    //fillOpacity: 0.3,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  const properties = layer.feature.properties;
  const copy = { ...properties };
  dispatch(setInfo(copy));
  const suburbId = properties.suburbId;
  dispatch(highlightFeature({ suburbId: suburbId, scroll: scroll }));
  if (properties.priceData?.priceIntrevalInfo) {
    dispatch(highlightLegendEntry(properties.priceData.priceIntrevalInfo.intervalMinPrice));
  }
};

const highlightFeatureById = (suburbId: string) => {
  highlightFeatureOnMap(layersBySuburbId[suburbId], false);
};

const applyByPriceInterval = (intervalMinPrice: number, func: (layer: CustomLayer) => void) => {
  const suburbIds = suburbIdsByPriceInterval[intervalMinPrice];
  if (suburbIds) {
    for (const suburbId of suburbIds) {
      const layer = layersBySuburbId[suburbId];
      layer && func(layer);
    }
  }
};

const unhighlightFeatureOnMap = (layer: CustomLayer) => {
  geoJsonElement?.leafletElement.resetStyle(layer);
  const properties = layer.feature.properties;
  const suburbId = properties.suburbId;
  dispatch(clearInfo());
  dispatch(unhighlightFeature(suburbId));
  if (properties.priceData?.priceIntrevalInfo) {
    dispatch(unhighlightLegendEntry(properties.priceData.priceIntrevalInfo.intervalMinPrice));
  }
};

const unhighlightFeatureById = (suburbId: string) => {
  unhighlightFeatureOnMap(layersBySuburbId[suburbId]);
};

const setFeaturePriceProperties = (properties: FeatureProperties) => {
  if (!properties.priceData && priceDataBySuburbId) {
    properties.priceData = priceDataBySuburbId[properties.suburbId];
  }
};

const setPricePopupContent = (layer: CustomLayer, properties: FeatureProperties) => {
  const setPopupContent = (layer: CustomLayer, popupContent: string) => {
    layer.setPopupContent(popupContent);
    layer.popupContent = popupContent;
  };

  const priceDataForFeature = properties.priceData;
  if (priceDataForFeature) {
    setPopupContent(
      layer,
      `${properties.popupContent}
    <div>${MoneyUtils.format(priceDataForFeature.medianPrice)}</div>`
    );
  } else {
    setPopupContent(layer, properties.popupContent);
  }
};

const getFeatureStyle: StyleFunction<FeatureProperties> = (feature) => {
  if (!feature) {
    return {};
  }
  const properties = feature.properties;
  const color = properties.priceData?.priceIntrevalInfo?.color;
  const propertiesCount = properties.priceData?.count;
  let opacity: number;
  if (propertiesCount) {
    opacity = propertiesCount < 2 ? 0.2 : propertiesCount < 5 ? 0.3 : propertiesCount < 10 ? 0.4 : propertiesCount < 15 ? 0.5 : propertiesCount < 20 ? 0.6 : propertiesCount < 25 ? 0.7 : propertiesCount < 30 ? 0.8 : 0.9;
  } else {
    opacity = 0;
  }
  if (color) {
    dispatch(setFeatureColor({ suburbId: properties.suburbId, color: color }));
  }

  // console.log('price for ' + feature?.properties.name + ': ' + medianPrice || 'not set');
  return {
    fillColor: color ? color : '#d1abf2',
    weight: 2,
    opacity: 1,
    color: 'dimgray',
    dashArray: '3',
    fillOpacity: opacity,
  };
};

const applyStyleToLayer = (layer: CustomLayer) => {
  const feature = layer.feature;
  layer.setStyle(getFeatureStyle(feature));
};

const applyPriceData = (data: RealEstateResponse[]) => {
  for (const priceData of data) {
    const suburbId = getSuburbId(priceData.locality, priceData.postCode);
    priceData.suburbId = suburbId;
  }

  const { pricesToColors, suburbsByPrice } = ColorUtils.calculatePricesToColors(data, colors);
  suburbIdsByPriceInterval = suburbsByPrice;

  dispatch(changePricesToColors(pricesToColors));

  console.log('Caclulated colors');

  const getRealEstateDictionary = (priceDataArray: RealEstateResponse[]) => {
    if (!priceDataArray) {
      return {};
    }
    const priceDataBySuburbId: {
      [suburbId: string]: RealEstateResponse;
    } = {};
    for (const priceData of priceDataArray) {
      const suburbId = priceData.suburbId;
      priceDataBySuburbId[suburbId] = priceData;
    }
    return priceDataBySuburbId;
  };

  priceDataBySuburbId = getRealEstateDictionary(data);
  for (const suburbId in layersBySuburbId) {
    const layer = layersBySuburbId[suburbId];
    const properties = layer.feature.properties;
    if (properties.priceData) {
      properties.priceData = undefined;
    }
    // Setting price properties for existing features when the prices are fetched
    setFeaturePriceProperties(properties);
    applyStyleToLayer(layer);
    setPricePopupContent(layer, properties);
  }
};

const fetchAndApplyPriceData = async (filters: FiltersState) => {
  const data = await fetchPriceDataDebounced(filters);
  if (data.length) {
    applyPriceData(data);
  }
};

const onEachFeature = (feature: GeoJSON.Feature<GeoJSON.Geometry, FeatureProperties>, layer: CustomLayer) => {
  const properties = feature.properties;

  layer.on({
    mouseover: (e: EventArgs<CustomLayer>) => highlightFeatureOnMap(e.target, true),
    mouseout: (e: EventArgs<CustomLayer>) => unhighlightFeatureOnMap(e.target),
    click: (e: EventArgs<CustomLayer>) => {
      const layer = e.target;
      zoomToFeatureOnMap(layer);
    },
  });

  const layersForFileName = layersByFileName[properties.fileName] || [];
  layersForFileName.push(layer);
  layersByFileName[properties.fileName] = layersForFileName;
  const suburbId = properties.suburbId;
  layersBySuburbId[suburbId] = layer;

  dispatch(
    addFeature({
      name: properties.name,
      suburbId: suburbId,
    } as FeatureInfo)
  );

  setPricePopupContent(layer, properties);
  // if priceData is fetched - the necessary properties and the style should be applied;
  if (priceDataBySuburbId) {
    applyStyleToLayer(layer);
  }

  layer.bindPopup(properties.popupContent);
};

const processCheckedDistricts = async (checkedDistricts: { [fileName: string]: undefined }) => {
  const addCheckedLayers = async (checkedDistricts: { [fileName: string]: undefined }) => {
    const addInfoToFeatures = (data: WithFeatures, fileName: string) => {
      for (const feature of data.features) {
        const properties = feature.properties;
        properties.fileName = fileName;
        const name = StringUtils.toTitleCase(properties.name || properties.Name || 'No Title');
        const postCode = parseInt(properties.description);
        properties.postCode = postCode;
        const suburbId = getSuburbId(name, postCode);
        properties.name = name;
        properties.suburbId = suburbId;
        properties.popupContent = `<h6>
          ${name} ${postCode}
        </h6>
        <div>${StringUtils.removePostfix(fileName)}</div>`;

        // Setting prices for new features when prices are already fetched and new layer is added
        setFeaturePriceProperties(properties);
      }
    };

    const applyPolygonData = (data: GeoJSON.GeoJsonObject | GeoJSON.GeoJsonObject[]) => {
      // this object contains all the layers, not just recently added
      const compoundLayer = geoJsonElement?.leafletElement.addData(data as GeoJSON.GeoJsonObject) as CompoundLayer;
      bounds = compoundLayer.getBounds();
    };

    for (const fileName in checkedDistricts) {
      if (fileName in currentlyCheckedDistricts) {
        continue;
      }

      const data = await fetchPolygonData(fileName);

      for (const withFeatures of data) {
        addInfoToFeatures(withFeatures, fileName);
      }

      applyPolygonData(data);
      currentlyCheckedDistricts[fileName] = undefined;
      console.log('Added ' + fileName);
    }

    const suburbKeys = Object.keys(layersBySuburbId).map((suburbId) => {
      const properties = layersBySuburbId[suburbId].feature.properties;
      return { postCode: properties.postCode, locality: properties.name } as SuburbKey;
    });

    dispatch(changePostCodes(suburbKeys));
  };

  const removeUncheckedLayers = (checkedDistricts: { [fileName: string]: undefined }) => {
    for (const fileName in layersByFileName) {
      if (!(fileName in checkedDistricts)) {
        const innerLayers = layersByFileName[fileName];
        for (const layer of innerLayers) {
          const compoundLayer = geoJsonElement?.leafletElement.removeLayer(layer);
          bounds = compoundLayer.getBounds();
          const properties = layer.feature.properties;
          dispatch(removeFeature(properties.suburbId));
          // console.log('Deleted feature ' + properties.name);
        }

        for (const layer of layersByFileName[fileName]) {
          delete layersBySuburbId[layer.feature.properties.suburbId];
        }
        delete layersByFileName[fileName];
        delete currentlyCheckedDistricts[fileName];
        console.log('Deleted ' + fileName);
      }
    }
  };
  removeUncheckedLayers(checkedDistricts);
  await addCheckedLayers(checkedDistricts);
  showAll();
};

const FeatureMap: React.FunctionComponent<FeatureMapProps> = ({ leafletMap }) => {
  mapElement = leafletMap;
  dispatch = useDispatch();
  const geojsonRef = useCallback((node) => {
    if (node !== null) {
      //use state to load (and display in GEOJson tag) all polygons that are already here
      geoJsonElement = node;
    }
  }, []);
  const districtList = useSelector(selectDistrictList);
  const filters = useSelector(selectFilters);

  useEffect(() => {
    processCheckedDistricts(districtList.checkedDistricts);
  }, [districtList]);

  useEffect(() => {
    fetchAndApplyPriceData(filters);
  }, [filters]);

  const { promiseInProgress } = usePromiseTracker({ area: priceDataSearchPromiseTrackerArea, delay: 0 });

  const renderLegendOrLoading = useCallback(() => {
    if (promiseInProgress) {
      return (
        <div className="spinner">
          <Loader type="TailSpin" color="#292929" height={70} width={70} />
        </div>
      );
    } else {
      return (
        <Legend
          onItemMouseOver={(intervalMinPrice) =>
            applyByPriceInterval(intervalMinPrice, (layer) => {
              highlightFeatureOnMap(layer, false);
            })
          }
          onItemMouseOut={(intervalMinPrice) =>
            applyByPriceInterval(intervalMinPrice, (layer) => {
              unhighlightFeatureOnMap(layer);
            })
          }
        />
      );
    }
  }, [promiseInProgress]);

  return useMemo(
    () => (
      <React.Fragment>
        <GeoJSON style={getFeatureStyle} ref={geojsonRef} data={[]} onEachFeature={onEachFeature} />
        <Control position="topleft">
          <FeatureList onItemMouseOver={highlightFeatureById} onItemMouseOut={unhighlightFeatureById} onItemClick={zoomToFeatureById} />
        </Control>
        <Control position="bottomleft">{renderLegendOrLoading()}</Control>
        <Control position="topright">
          <Info />
        </Control>
        <Control position="bottomright">
          <div className="leaflet-bar">
            <ShowAll onClick={showAll} />
            <CurrentLocation onLocationFound={(coords) => showLocation(coords)} />
          </div>
        </Control>
        <ZoomControl position="bottomright" />
      </React.Fragment>
    ),
    [geojsonRef, renderLegendOrLoading]
  );
};

FeatureMap.propTypes = {
  leafletMap: PropTypes.any.isRequired,
};

export default React.memo(FeatureMap);
