import React, { useCallback, useEffect, Dispatch, useMemo } from 'react';
import { GeoJSON, ZoomControl } from 'react-leaflet';
import L, { StyleFunction, Map, LatLngBounds } from 'leaflet';
import Info from '../info/Info';
import { useDispatch, useSelector } from 'react-redux';
import { addFeature, removeFeature, highlightFeature, unhighlightFeature } from '../featureList/featureListSlice';
import Legend from '../legend/Legend';
import Control from 'react-leaflet-control';
import FeatureList from '../featureList/FeatureList';
import StringUtils from '../../utils/stringUtils';
import axios from 'axios';
import PropTypes from 'prop-types';
import { setInfo, clearInfo } from '../info/infoSlice';
import ShowAll from '../showAll/ShowAll';
import CurrentLocation from '../currentLocation/CurrentLocation';
import MoneyUtils from '../../utils/moneyUtils';
import { selectDistrictList } from '../districtList/districtListSlice';
import { selectFilters, changePostCodes, FiltersState } from '../filters/filtersSlice';
import { changePricesToColors } from '../legend/legendSlice';
import * as topojson from 'topojson-client';
import { RealEstateResponse, CustomLayer, CompoundLayer, EventArgs, FeatureProperties, WithFeatures, SuburbKey } from '../../interfaces';
import { debounce } from 'ts-debounce';
import ColorUtils from '../../utils/colorUtils';
interface FeatureMapProps {
  leafletMap: Map;
}

let mapElement: Map | undefined;
let bounds: LatLngBounds | undefined;
let geoJsonElement: GeoJSON;
let dispatch: Dispatch<unknown> | undefined;
let priceDictionary: { [suburbId: string]: RealEstateResponse } | undefined = undefined;
const currentlyCheckedDistricts: { [fileName: string]: undefined } = {};
const layersBySuburbId: { [id: string]: CustomLayer } = {};
const layersByFileName: { [fileName: string]: CustomLayer[] } = {};

const colors = ColorUtils.generateColors(16);

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

const zoomToFeatureById = (id: string) => {
  zoomToFeatureOnMap(layersBySuburbId[id]);
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
  if (properties && dispatch) {
    dispatch(setInfo(properties.priceDataForFeature || ({ locality: properties.name, postCode: properties.postCode } as RealEstateResponse)));
    const id = properties.id;
    dispatch(highlightFeature({ id, scroll: scroll }));
  }
};

const highlightFeatureById = (id: string) => {
  highlightFeatureOnMap(layersBySuburbId[id], false);
};

const unhighlightFeatureOnMap = (layer: CustomLayer) => {
  geoJsonElement?.leafletElement.resetStyle(layer);
  const properties = layer.feature.properties;
  if (properties && dispatch) {
    const id = properties.id;
    dispatch(clearInfo());
    dispatch(unhighlightFeature(id));
  }
};

const unhighlightFeatureById = (id: string) => {
  unhighlightFeatureOnMap(layersBySuburbId[id]);
};

const setFeaturePriceProperties = (properties: FeatureProperties) => {
  if (!properties.priceDataForFeature && priceDictionary) {
    properties.priceDataForFeature = priceDictionary[properties.id];
  }
};

const setPricePopupContent = (layer: CustomLayer, properties: FeatureProperties) => {
  const setPopupContent = (layer: CustomLayer, popupContent: string) => {
    layer.setPopupContent(popupContent);
    layer.popupContent = popupContent;
  };

  const priceDataForFeature = properties.priceDataForFeature;
  if (priceDataForFeature) {
    setPopupContent(layer, `${properties.popupContent}<div>${MoneyUtils.format(priceDataForFeature.medianPrice)}</div>`);
  } else {
    setPopupContent(layer, properties.popupContent);
  }
};

const getFeatureStyle: StyleFunction<FeatureProperties> = (feature) => {
  if (!feature) {
    return {};
  }
  const color = feature.properties.priceDataForFeature?.priceSubIntrevalInfo?.color;

  // console.log('price for ' + feature?.properties.name + ': ' + medianPrice || 'not set');
  return {
    fillColor: color ? color : '#d1abf2',
    weight: 2,
    opacity: 1,
    color: 'dimgray',
    dashArray: '3',
    fillOpacity: color ? 0.9 : 0.3,
  };
};

const applyStyleToLayer = (layer: CustomLayer) => {
  const feature = layer.feature;
  layer.setStyle(getFeatureStyle(feature));
};

const fetchPriceData = debounce(
  async (filters: FiltersState) => {
    if (!filters.postCodes.length) {
      return;
    }

    const getMinValue = (value: [number, number]) => {
      return value[0];
    };

    const getMaxValue = (value: [number, number]) => {
      return value[1];
    };

    const bedroomsMin = getMinValue(filters.bedrooms);
    const bedroomsMax = getMaxValue(filters.bedrooms);
    const bathroomsMin = getMinValue(filters.bathrooms);
    const bathroomsMax = getMaxValue(filters.bathrooms);
    const parkingSpacesMin = getMinValue(filters.parkingSpaces);
    const parkingSpacesMax = getMaxValue(filters.parkingSpaces);
    const isRent = filters.dealType === 'rent';
    const url =
      process.env.REACT_APP_PRICES_API_URL +
      `RealEstate?isRent=${isRent}&propertyTypes=${filters.propertyType}&constructionStatus=${filters.constructionStatus}&allowedWindowInDays=${filters.allowedWindowInDays}&mainPriceOnly=${filters.mainPriceOnly}&bedroomsMin=${bedroomsMin}&bedroomsMax=${bedroomsMax}&bathroomsMin=${bathroomsMin}&bathroomsMax=${bathroomsMax}&parkingSpacesMin=${parkingSpacesMin}&parkingSpacesMax=${parkingSpacesMax}`;
    console.log(`Fetching ${url}...`);
    try {
      const priceDataResponse = await axios.post<RealEstateResponse[]>(url, filters.postCodes);
      console.log('Got prices');
      const data = priceDataResponse.data;

      const pricesToColors = ColorUtils.calculatePricesToColors(data, colors);
      if (dispatch) {
        dispatch(changePricesToColors(pricesToColors));
      }

      console.log('Caclulated colors');

      const getRealEstateDictionary = (priceDataArray: RealEstateResponse[]) => {
        if (!priceDataArray) {
          return {};
        }
        const realEstateDictionary: {
          [suburbId: string]: RealEstateResponse;
        } = {};
        for (const element of priceDataArray) {
          const suburbId = getSuburbId(element.locality, element.postCode);
          realEstateDictionary[suburbId] = element;
        }
        return realEstateDictionary;
      };

      priceDictionary = getRealEstateDictionary(data);
      for (const suburbId in layersBySuburbId) {
        const layer = layersBySuburbId[suburbId];
        const properties = layer.feature.properties;
        if (properties.priceDataForFeature) {
          properties.priceDataForFeature = undefined;
        }
        // Setting price properties for existing features when the prices are fetched
        setFeaturePriceProperties(properties);
        applyStyleToLayer(layer);
        setPricePopupContent(layer, properties);
      }
    } catch (e) {
      console.error('Cannot get prices: ' + e);
    }
  },
  400,
  { isImmediate: false }
);

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
  const id = properties.id;
  layersBySuburbId[id] = layer;

  if (dispatch) {
    dispatch(
      addFeature({
        name: properties.name,
        id: id,
      })
    );
  }

  setPricePopupContent(layer, properties);
  // if priceData is fetched - the necessary properties and the style should be applied;
  if (priceDictionary) {
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
        properties.id = suburbId;
        properties.popupContent = `<h6>
          ${name} ${postCode}
        </h6>`;

        // Setting prices for new features when prices are already fetched and new layer is added
        setFeaturePriceProperties(properties);
      }
    };

    const fetchPolygonData = async (fileName: string) => {
      return (await axios.get<TopoJSON.Topology<TopoJSON.Objects<GeoJSON.GeoJsonProperties>> | GeoJSON.GeoJsonObject>(process.env.PUBLIC_URL + '/geo/' + fileName)).data;
    };

    const applyPolygonData = (data: GeoJSON.GeoJsonObject | GeoJSON.GeoJsonObject[]) => {
      // this object contains all the layers, not just recently added
      const compoundLayer = geoJsonElement?.leafletElement.addData(data as GeoJSON.GeoJsonObject) as CompoundLayer;
      bounds = compoundLayer.getBounds();
      showAll();
    };

    for (const fileName in checkedDistricts) {
      if (fileName in currentlyCheckedDistricts) {
        continue;
      }

      const response = await fetchPolygonData(fileName);
      console.log('Got polygons for ' + fileName);
      const data: WithFeatures[] = [];
      if (response.type === 'Topology') {
        for (const key in response.objects) {
          const geojsonData = topojson.feature(response, response.objects[key]);
          data.push(geojsonData as WithFeatures);
        }
      } else {
        data.push(response as WithFeatures);
      }

      for (const withFeatures of data) {
        addInfoToFeatures(withFeatures, fileName);
      }

      applyPolygonData(data);
      currentlyCheckedDistricts[fileName] = undefined;
      console.log('Added ' + fileName);
    }

    if (dispatch) {
      const suburbKeys = Object.keys(layersBySuburbId).map((suburbId) => {
        const properties = layersBySuburbId[suburbId].feature.properties;
        return { postCode: properties.postCode, locality: properties.name } as SuburbKey;
      });

      dispatch(changePostCodes(suburbKeys));
    }
  };

  const removeUncheckedLayers = (checkedDistricts: { [fileName: string]: undefined }) => {
    for (const fileName in layersByFileName) {
      if (!(fileName in checkedDistricts)) {
        const innerLayers = layersByFileName[fileName];
        for (const layer of innerLayers) {
          const compoundLayer = geoJsonElement?.leafletElement.removeLayer(layer);
          bounds = compoundLayer.getBounds();
          showAll();
          const properties = layer.feature?.properties;
          if (dispatch && properties) {
            dispatch(removeFeature(properties.id));
            // console.log('Deleted feature ' + properties.name);
          }
        }

        for (const layer of layersByFileName[fileName]) {
          delete layersBySuburbId[layer.feature.properties.id];
        }
        delete layersByFileName[fileName];
        delete currentlyCheckedDistricts[fileName];
        console.log('Deleted ' + fileName);
      }
    }
  };
  removeUncheckedLayers(checkedDistricts);
  await addCheckedLayers(checkedDistricts);
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
    fetchPriceData(filters);
  }, [filters]);

  return useMemo(
    () => (
      <React.Fragment>
        <GeoJSON style={getFeatureStyle} ref={geojsonRef} data={[]} onEachFeature={onEachFeature} />
        <Control position="topleft">
          <FeatureList onFeatureEntryMouseOver={highlightFeatureById} onFeatureEntryMouseOut={unhighlightFeatureById} onFeatureEntryClick={zoomToFeatureById} />
        </Control>
        <Control position="bottomleft">
          <Legend />
        </Control>
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
    [geojsonRef]
  );
};

FeatureMap.propTypes = {
  leafletMap: PropTypes.any.isRequired,
};

export default React.memo(FeatureMap);
