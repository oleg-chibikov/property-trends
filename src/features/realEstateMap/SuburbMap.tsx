import L, { LatLngBounds, Map, StyleFunction } from 'leaflet';
import PropTypes from 'prop-types';
import React, { Dispatch, useCallback, useEffect, useMemo } from 'react';
import { GeoJSON, ZoomControl } from 'react-leaflet';
import Control from 'react-leaflet-control';
import { useDispatch, useSelector } from 'react-redux';
import fetchPolygonData from '../../backendRequests/polygonRetrieval';
import fetchPriceDataDebounced from '../../backendRequests/priceDataSearch';
import { CompoundLayer, CustomLayer, EventArgs, FeatureProperties, RealEstateResponse, SuburbInfo, SuburbKey, WithFeatures, WithMap } from '../../interfaces';
import ColorUtils from '../../utils/colorUtils';
import MoneyUtils from '../../utils/moneyUtils';
import StringUtils from '../../utils/stringUtils';
import CurrentLocation from '../currentLocation/CurrentLocation';
import { selectDistrictList } from '../districtList/districtListSlice';
import { changePostCodes, FiltersState, selectFilters } from '../filters/filtersSlice';
import Info from '../info/Info';
import { clearInfo, setInfo } from '../info/infoSlice';
import Legend from '../legend/Legend';
import { changePricesToColors, highlightLegendEntry, unhighlightLegendEntry } from '../legend/legendSlice';
import { selectHighlightedSuburb, selectSelectedSuburb } from '../search/searchBoxSlice';
import ShowAll from '../showAll/ShowAll';
import SuburbList from '../suburbList/SuburbList';
import { addSuburb, highlightSuburb, removeSuburb, scrollToSuburb, setSuburbColor, unhighlightSuburb } from '../suburbList/suburbListSlice';

let mapElement: Map | undefined;
let bounds: LatLngBounds | undefined;
let geoJsonElement: GeoJSON;
let dispatch: Dispatch<unknown>;
let priceDataBySuburbId: { [suburbId: string]: RealEstateResponse } | undefined = undefined;
let suburbIdsByPriceInterval: { [price: number]: string[] } = {};
const currentlyCheckedDistricts: { [fileName: string]: undefined } = {};
const layersBySuburbId: { [suburbId: string]: CustomLayer } = {};
const layersByFileName: { [fileName: string]: CustomLayer[] } = {};
let searchBoxSelectedSuburbId: string | undefined;
let searchBoxHighlightedSuburbId: string | undefined;

const colors = ColorUtils.generateColors(15);

const highlightAll = (layer: CustomLayer) => {
  const properties = layer.feature.properties;
  const suburbId = properties.suburbId;
  highlightLayerOnMap(layer);
  showInfo(properties);
  highlightSuburbInLegend(properties);
  highlightSuburbInList(suburbId);
};

const unhighlightAll = (layer: CustomLayer) => {
  const properties = layer.feature.properties;
  const suburbId = properties.suburbId;
  unhighlightLayerOnMap(layer);
  hideInfo();
  unhighlightSuburbInList(suburbId);
  unhighlightSuburbInLegend(properties);
};

const showAll = () => {
  if (bounds && mapElement && bounds.isValid()) {
    mapElement.fitBounds(bounds);
  }
};

const showLocation = (coords: Coordinates) => {
  mapElement?.setView([coords.latitude, coords.longitude], 11);
};

const zoomToLayerOnMap = (layer: CustomLayer) => {
  mapElement?.fitBounds(layer.getBounds());
};

const onSuburbListClick = (suburbId: string) => {
  const layer = layersBySuburbId[suburbId];
  layer && zoomToLayerOnMap(layer);
};

const onSuburbListMouseOver = (suburbId: string) => {
  const layer = layersBySuburbId[suburbId];
  layer && highlightAll(layer);
};

const onSuburbListMouseOut = (suburbId: string) => {
  const layer = layersBySuburbId[suburbId];
  layer && unhighlightAll(layer);
};

const onLegendEntryMouseOver = (intervalMinPrice: number) => {
  applyByPriceInterval(intervalMinPrice, (suburbId) => {
    const layer = layersBySuburbId[suburbId];
    layer && highlightAll(layer);
  });
};

const onLegendEntryMouseOut = (intervalMinPrice: number) => {
  applyByPriceInterval(intervalMinPrice, (suburbId) => {
    const layer = layersBySuburbId[suburbId];
    layer && unhighlightAll(layer);
  });
};

const onSearchBoxHighlightedStatusChange = (suburbId: string | undefined, previousSuburbId: string | undefined) => {
  if (suburbId) {
    const layer = layersBySuburbId[suburbId];
    layer && highlightAll(layer);
  } else if (previousSuburbId) {
    const layer = layersBySuburbId[previousSuburbId];
    layer && unhighlightAll(layer);
  }
};

const onSearchBoxSelectedItemChange = (suburbId: string | undefined) => {
  if (suburbId) {
    const layer = layersBySuburbId[suburbId];
    if (layer) {
      zoomToLayerOnMap(layer);
      highlightAll(layer);
      scrollToSuburbInList(suburbId);
      return true;
    }
  }
  return false;
};

const showInfo = (properties: FeatureProperties) => {
  const copy = { ...properties };
  dispatch(setInfo(copy));
};

const hideInfo = () => {
  dispatch(clearInfo());
};

const scrollToSuburbInList = (suburbId: string) => {
  dispatch(scrollToSuburb(suburbId));
};

const highlightSuburbInList = (suburbId: string) => {
  dispatch(highlightSuburb(suburbId));
};

const unhighlightSuburbInList = (suburbId: string) => {
  dispatch(unhighlightSuburb(suburbId));
};

const highlightSuburbInLegend = (properties: FeatureProperties) => {
  if (properties.priceData?.priceIntrevalInfo) {
    dispatch(highlightLegendEntry(properties.priceData.priceIntrevalInfo.intervalMinPrice));
  }
};

const unhighlightSuburbInLegend = (properties: FeatureProperties) => {
  if (properties.priceData?.priceIntrevalInfo) {
    dispatch(unhighlightLegendEntry(properties.priceData.priceIntrevalInfo.intervalMinPrice));
  }
};

const highlightLayerOnMap = (layer: CustomLayer) => {
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
};

const unhighlightLayerOnMap = (layer: CustomLayer) => {
  geoJsonElement?.leafletElement.resetStyle(layer);
};

const applyByPriceInterval = (intervalMinPrice: number, func: (suburbId: string) => void) => {
  const suburbIds = suburbIdsByPriceInterval[intervalMinPrice];
  if (suburbIds) {
    for (const suburbId of suburbIds) {
      func(suburbId);
    }
  }
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
  const propertyCount = properties.priceData?.count;
  const opacity: number = ColorUtils.getOpacityByPropertyCount(propertyCount);
  if (color) {
    dispatch(setSuburbColor({ suburbId: properties.suburbId, color: color }));
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
  if (!data.length) {
    // clear the legend
    dispatch(changePricesToColors({}));
    return;
  }
  for (const priceData of data) {
    const suburbId = StringUtils.getSuburbId(priceData.locality, priceData.postCode);
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
    if (suburbId === searchBoxSelectedSuburbId) {
      highlightLayerOnMap(layer);
    }
  }
};

const fetchAndApplyPriceData = async (filters: FiltersState) => {
  const data = await fetchPriceDataDebounced(filters);
  applyPriceData(data);
};

const onEachFeature = (feature: GeoJSON.Feature<GeoJSON.Geometry, FeatureProperties>, layer: CustomLayer) => {
  const properties = feature.properties;

  layer.on({
    mouseover: (e: EventArgs<CustomLayer>) => {
      const layer = e.target;
      highlightAll(layer);
      const properties = layer.feature.properties;
      const suburbId = properties.suburbId;
      scrollToSuburbInList(suburbId);
      highlightSuburbInLegend(properties);
    },
    mouseout: (e: EventArgs<CustomLayer>) => {
      const layer = e.target;
      unhighlightAll(layer);
    },
    click: (e: EventArgs<CustomLayer>) => {
      const layer = e.target;
      zoomToLayerOnMap(layer);
    },
  });

  const layersForFileName = layersByFileName[properties.fileName] || [];
  layersForFileName.push(layer);
  layersByFileName[properties.fileName] = layersForFileName;
  const suburbId = properties.suburbId;
  layersBySuburbId[suburbId] = layer;

  dispatch(
    addSuburb({
      name: properties.name,
      suburbId: suburbId,
    } as SuburbInfo)
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
        const suburbId = StringUtils.getSuburbId(name, postCode);
        properties.name = name;
        properties.suburbId = suburbId;
        properties.popupContent = `<h3>
          ${name} ${StringUtils.padPostCode(postCode)}
        </h3>
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
          dispatch(removeSuburb(properties.suburbId));
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
  if (!onSearchBoxSelectedItemChange(searchBoxSelectedSuburbId)) {
    showAll();
  }
};

const SuburbMap: React.FunctionComponent<WithMap> = ({ leafletMap }) => {
  mapElement = leafletMap;
  dispatch = useDispatch();
  const districtList = useSelector(selectDistrictList);
  const filters = useSelector(selectFilters);
  const previousSearchBoxHighlightedSuburbId = searchBoxHighlightedSuburbId;
  const previousSearchBoxSelectedSuburbId = searchBoxSelectedSuburbId;
  searchBoxSelectedSuburbId = useSelector(selectSelectedSuburb);
  searchBoxHighlightedSuburbId = useSelector(selectHighlightedSuburb);
  useEffect(() => {
    processCheckedDistricts(districtList.checkedDistricts);
  }, [districtList]);
  useEffect(() => {
    fetchAndApplyPriceData(filters);
  }, [filters]);
  const geojsonRef = useCallback((node) => {
    if (node !== null) {
      // use state to load (and display in GEOJson tag) all polygons that are already here
      geoJsonElement = node;
    }
  }, []);

  if (searchBoxHighlightedSuburbId !== previousSearchBoxHighlightedSuburbId) {
    onSearchBoxHighlightedStatusChange(searchBoxHighlightedSuburbId, previousSearchBoxHighlightedSuburbId);
  }
  if (searchBoxSelectedSuburbId !== previousSearchBoxSelectedSuburbId) {
    onSearchBoxSelectedItemChange(searchBoxSelectedSuburbId);
  }

  return useMemo(
    () => (
      <React.Fragment>
        <GeoJSON style={getFeatureStyle} ref={geojsonRef} data={[]} onEachFeature={onEachFeature} />
        <Control position="topleft">
          <SuburbList leafletMap={leafletMap} onItemMouseOver={onSuburbListMouseOver} onItemMouseOut={onSuburbListMouseOut} onItemClick={onSuburbListClick} />
        </Control>
        <Control position="bottomleft">
          <Legend onItemMouseOver={onLegendEntryMouseOver} onItemMouseOut={onLegendEntryMouseOut} />
        </Control>
        <Control position="topright">
          <Info />
        </Control>
        <Control position="bottomright">
          <div className="leaflet-bar">
            <ShowAll onClick={showAll} />
            <CurrentLocation onLocationFound={showLocation} />
          </div>
        </Control>
        <ZoomControl position="bottomright" />
      </React.Fragment>
    ),
    [geojsonRef, leafletMap]
  );
};

SuburbMap.propTypes = {
  leafletMap: PropTypes.any.isRequired,
};

export default React.memo(SuburbMap);
