import Apartment from '@material-ui/icons/Apartment';
import Home from '@material-ui/icons/Home';
import { LatLngBounds, Map, StyleFunction } from 'leaflet';
import PropTypes from 'prop-types';
import React, { Dispatch, useCallback, useEffect, useMemo, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { GeoJSON } from 'react-leaflet';
import Control from 'react-leaflet-control';
import { trackPromise } from 'react-promise-tracker';
import { useDispatch, useSelector } from 'react-redux';
import fetchPolygonData from '../../backendRequests/polygonRetrieval';
import fetchPriceData from '../../backendRequests/priceDataSearch';
import { CompoundLayer, CustomLayer, FeatureProperties, MapFilters, NewFeatureProperties, RealEstateResponse, SuburbInfo, WithFeatures, WithMap } from '../../interfaces';
import ColorUtils from '../../utils/colorUtils';
import DomainUtils from '../../utils/domainUtils';
import MapUtils from '../../utils/mapUtils';
import MoneyUtils from '../../utils/moneyUtils';
import StringUtils from '../../utils/stringUtils';
import CurrentLocation from '../currentLocation/CurrentLocation';
import { selectCheckedDistricts } from '../districtList/districtListSlice';
import { changeDistricts, selectDistricts, selectFilters } from '../filters/filtersSlice';
import Info from '../info/Info';
import Legend from '../legend/Legend';
import { changePricesToColors } from '../legend/legendSlice';
import { selectHighlightedSuburb, selectSelectedSuburb } from '../search/searchBoxSlice';
import ShowAll from '../showAll/ShowAll';
import SuburbList from '../suburbList/SuburbList';
import { replaceSuburbs, setSuburbColor } from '../suburbList/suburbListSlice';
import Highlighter from './highlighter';
import MapConstants from './mapConstants';
import SuburbMapEventHandler from './suburbMapEventHandler';

let isApartment: boolean;
const apartmentHtml = renderToString(<Apartment />);
const houseHtml = renderToString(<Home />);
let highlighter: Highlighter;
let eventHandler: SuburbMapEventHandler;
let mapElement: Map;
let bounds: LatLngBounds | undefined;
let geoJsonElement: GeoJSON;
let dispatch: Dispatch<unknown>;
let priceDataBySuburbId: { [suburbId: string]: RealEstateResponse } | undefined = undefined;
const currentlyCheckedDistricts: { [fileName: string]: undefined } = {};
const layersBySuburbId: { [suburbId: string]: CustomLayer } = {};
const layersByFileName: { [fileName: string]: CustomLayer[] } = {};
let searchBoxSelectedSuburbId: string | undefined;
let searchBoxHighlightedSuburbId: string | undefined;
export const processDistrictsPromiseTrackerArea = 'processDistricts';

const colors = ColorUtils.generateColors(15);

const setFeaturePriceProperties = (properties: FeatureProperties) => {
  if (!properties.priceData && priceDataBySuburbId) {
    properties.priceData = priceDataBySuburbId[properties.suburbId];
  }
};

const setLayerPopupAndTooltip = (layer: CustomLayer) => {
  const properties = layer.feature.properties;
  const name = properties.locality;
  const priceDataForFeature = properties.priceData;
  const formattedPostCode = DomainUtils.padPostCode(properties.postCode);
  // const realEstateSuburbUri = DomainUtils.getRealEstateSuburbUri(name, formattedPostCode, properties.state);
  // const realEstateLink = `<a href='${realEstateSuburbUri}' target="_blank">${name} ${formattedPostCode}</a>`;
  const tooltipContent = priceDataForFeature
    ? `<h4>${name} ${formattedPostCode}</h4><div>${MoneyUtils.format(priceDataForFeature.medianPrice)} - ${priceDataForFeature.count} ${isApartment ? apartmentHtml : houseHtml}<div>`
    : `<div>${name} ${formattedPostCode}</div>`;
  layer.setTooltipContent(tooltipContent);
  return tooltipContent;
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

  // console.log('price for ' + feature?.properties.locality + ': ' + medianPrice || 'not set');
  return {
    fillColor: color ? color : '#d1abf2',
    weight: 1,
    opacity: 0.3,
    color: 'dimgray',
    // dashArray: '3',
    fillOpacity: opacity,
  };
};

const applyStyleToLayer = (layer: CustomLayer) => {
  const feature = layer.feature;
  layer.setStyle(getFeatureStyle(feature));
};

const applyPriceData = (data: RealEstateResponse[]) => {
  console.log('Applying price data...');
  if (!data.length) {
    console.log('No data available');
    return;
  }

  for (const priceData of data) {
    const suburbId = DomainUtils.getSuburbId(priceData.locality, priceData.postCode);
    priceData.suburbId = suburbId;
  }

  const { pricesToColors, suburbsByPrice } = ColorUtils.calculatePricesToColors(data, colors);
  eventHandler.setSuburbIdsByPriceInterval(suburbsByPrice);

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

    // Setting price properties for existing features when the prices are fetched
    setFeaturePriceProperties(properties);
    applyStyleToLayer(layer);
    setLayerPopupAndTooltip(layer);
    if (suburbId === searchBoxSelectedSuburbId) {
      highlighter.highlightLayer(layer);
    }
  }
};

const fetchAndApplyPriceData = (filters: MapFilters, districts: string[]) => {
  let ignore = false;

  const cleanup = () => {
    const resetAllLayers = () => {
      const resetPriceData = (properties: FeatureProperties) => {
        properties.priceData = undefined;
      };

      for (const suburbId in layersBySuburbId) {
        const layer = layersBySuburbId[suburbId];
        const properties = layer.feature.properties;
        resetPriceData(properties);
        applyStyleToLayer(layer);
        setLayerPopupAndTooltip(layer);
      }
    };

    const cleanupLegend = () => dispatch(changePricesToColors({}));

    cleanupLegend();
    resetAllLayers();
  };

  cleanup();

  const fetchData = async () => {
    try {
      return await fetchPriceData(filters, districts);
    } catch {
      //debounce error;
      return null;
    }
  };

  const applyData = async () => {
    const data = await fetchData();
    if (!ignore) {
      if (data) {
        applyPriceData(data);
      }
    } else {
      console.log('Ignored applying previous price data as it is not the most recent');
    }
  };

  applyData();

  return () => {
    ignore = true;
  };
};

const onEachFeature = (feature: GeoJSON.Feature<GeoJSON.Geometry, FeatureProperties>, layer: CustomLayer) => {
  const properties = feature.properties;

  layer.on({
    mouseover: eventHandler.onLayerMouseOver,
    mouseout: eventHandler.onLayerMouseOut,
    click: eventHandler.onLayerClick,
    mousedown: eventHandler.onLayerMouseDown,
    mouseup: eventHandler.onLayerMouseUp,
    dblclick: eventHandler.onLayerDoubleClick,
  });

  const layersForFileName = layersByFileName[properties.fileName] || [];
  layersForFileName.push(layer);
  layersByFileName[properties.fileName] = layersForFileName;
  const suburbId = properties.suburbId;
  layersBySuburbId[suburbId] = layer;

  // if priceData is fetched - the necessary properties and the style should be applied;
  if (priceDataBySuburbId) {
    applyStyleToLayer(layer);
  }

  // layer.bindPopup('');
  const tooltipContent = setLayerPopupAndTooltip(layer);
  layer.bindTooltip(tooltipContent, { permanent: true, direction: 'center', interactive: false, className: 'suburb-tooltip' });
  // for some reason it doesn't work without setTimeout
  setTimeout(() => {
    if (mapElement.getZoom() >= MapConstants.tooltipZoom) {
      layer.openTooltip();
    } else {
      layer.closeTooltip();
    }
  }, 0);
};

const processCheckedDistricts = async (checkedDistrictFileNames: { [fileName: string]: number }) => {
  const getPricesForCheckedDistricts = () => {
    const checkedDistrictFileNamesKeys = Object.keys(checkedDistrictFileNames);
    if (checkedDistrictFileNamesKeys.length) {
      const districtsToFetch = checkedDistrictFileNamesKeys.map(DomainUtils.getDistrictNameFromFileName);
      dispatch(changeDistricts(districtsToFetch));
    }
  };

  // search for prices in parallel with fetching districts
  getPricesForCheckedDistricts();

  const processDistricts = async () => {
    const addCheckedLayers = async (checkedDistrictFileNames: { [fileName: string]: number }) => {
      const suburbsToAdd: { [suburbId: string]: SuburbInfo } = {};
      const addInfoToFeatures = (data: WithFeatures, fileName: string) => {
        const readPropertiesFromNewFeature = (properties: NewFeatureProperties) => {
          const name = StringUtils.toTitleCase(properties.name || properties.Name || 'No Title');
          const postCode = parseInt(properties.description);
          return { postCode, name };
        };
        for (const feature of data.features) {
          const { postCode, name } = readPropertiesFromNewFeature((feature.properties as unknown) as NewFeatureProperties);

          const properties = feature.properties;
          properties.fileName = fileName;
          const { state, district } = DomainUtils.getStateAndDistrictFromFileName(fileName);
          properties.district = district;
          properties.state = state;
          properties.postCode = postCode;
          const suburbId = DomainUtils.getSuburbId(name, postCode);
          properties.locality = name;
          properties.suburbId = suburbId;
          suburbsToAdd[suburbId] = {
            name,
            suburbId,
          };

          // Setting prices for new features when prices are already fetched and new layer is added
          setFeaturePriceProperties(properties);
        }
      };

      const applyPolygonData = (data: GeoJSON.GeoJsonObject | GeoJSON.GeoJsonObject[]) => {
        // this object contains all the layers, not just recently added
        const compoundLayer = geoJsonElement.leafletElement.addData(data as GeoJSON.GeoJsonObject) as CompoundLayer;
        bounds = compoundLayer.getBounds();
      };
      for (const districtFileName in checkedDistrictFileNames) {
        if (districtFileName in currentlyCheckedDistricts) {
          for (const layer of layersByFileName[districtFileName]) {
            const name = layer.feature.properties.locality;
            const suburbId = layer.feature.properties.suburbId;
            suburbsToAdd[suburbId] = {
              name,
              suburbId,
            };
          }
          continue;
        }

        const data = await fetchPolygonData(districtFileName);

        for (const withFeatures of data) {
          addInfoToFeatures(withFeatures, districtFileName);
        }

        applyPolygonData(data);
        currentlyCheckedDistricts[districtFileName] = undefined;
        console.log('Added ' + districtFileName);
      }

      dispatch(replaceSuburbs(suburbsToAdd));
    };

    const removeUncheckedLayers = (checkedDistricts: { [fileName: string]: number }) => {
      for (const fileName in layersByFileName) {
        if (!(fileName in checkedDistricts)) {
          const innerLayers = layersByFileName[fileName];
          for (const layer of innerLayers) {
            const compoundLayer = geoJsonElement.leafletElement.removeLayer(layer);
            bounds = compoundLayer.getBounds();
          }

          for (const layer of innerLayers) {
            delete layersBySuburbId[layer.feature.properties.suburbId];
          }
          delete layersByFileName[fileName];
          delete currentlyCheckedDistricts[fileName];
          console.log('Deleted ' + fileName);
        }
      }
    };

    removeUncheckedLayers(checkedDistrictFileNames);
    await addCheckedLayers(checkedDistrictFileNames);
    // Searchbox requires new file to be loaded - select here and show selected suburb
    if (!eventHandler.onSearchBoxSelectedItemChange(searchBoxSelectedSuburbId)) {
      eventHandler.showBounds(bounds);
    }

    MapUtils.redrawMap(mapElement);
  };

  const processDistrictsWithPromiseTracking = async () => await trackPromise(processDistricts(), processDistrictsPromiseTrackerArea);

  await processDistrictsWithPromiseTracking();
};

const SuburbMap: React.FunctionComponent<WithMap> = ({ leafletMap }) => {
  mapElement = leafletMap;
  const [handler, setHandler] = useState<SuburbMapEventHandler>();
  dispatch = useDispatch();
  const checkedDistrictFileNames = useSelector(selectCheckedDistricts);
  const filters = useSelector(selectFilters);
  const districts = useSelector(selectDistricts);
  // This is used to display proper icon in tooltips
  isApartment = filters.propertyType === 'apartment';
  searchBoxSelectedSuburbId = useSelector(selectSelectedSuburb);
  searchBoxHighlightedSuburbId = useSelector(selectHighlightedSuburb);
  const previousSearchBoxHighlightedSuburbId = searchBoxHighlightedSuburbId;
  const previousSearchBoxSelectedSuburbId = searchBoxSelectedSuburbId;
  useEffect(() => {
    processCheckedDistricts(checkedDistrictFileNames);
  }, [checkedDistrictFileNames]);
  useEffect(() => {
    return fetchAndApplyPriceData(filters, districts);
  }, [filters, districts]);
  const geojsonRef = useCallback((node) => {
    if (node !== null) {
      // use state to load (and display in GEOJson tag) all polygons that are already here
      geoJsonElement = node;
      highlighter = new Highlighter(dispatch, geoJsonElement);
      setHandler(new SuburbMapEventHandler(dispatch, mapElement, highlighter, layersBySuburbId));
    }
  }, []);

  if (handler) {
    eventHandler = handler;
    if (searchBoxHighlightedSuburbId !== previousSearchBoxHighlightedSuburbId) {
      handler.onSearchBoxHighlightedStatusChange(searchBoxHighlightedSuburbId, previousSearchBoxHighlightedSuburbId);
    }
    if (searchBoxSelectedSuburbId !== previousSearchBoxSelectedSuburbId) {
      handler.onSearchBoxSelectedItemChange(searchBoxSelectedSuburbId);
    }
  }

  return useMemo(
    () => (
      <React.Fragment>
        <GeoJSON style={getFeatureStyle} ref={geojsonRef} data={[]} onEachFeature={onEachFeature} />
        <Control position="topleft">
          {handler && <SuburbList leafletMap={mapElement} onItemMouseOver={handler.onSuburbListEntryMouseOver} onItemMouseOut={handler.onSuburbListEntryMouseOut} onItemClick={handler.onSuburbListEntryClick} />}
        </Control>
        <Control position="bottomleft">{handler && <Legend onItemClick={handler.onLegendEntryClick} onItemMouseOut={handler.onLegendEntryMouseOut} />}</Control>
        <Control position="topright">
          <Info />
        </Control>
        <Control position="bottomright">
          {handler && (
            <div className="leaflet-bar location-buttons">
              <ShowAll onClick={() => handler.showBounds(bounds)} />
              <CurrentLocation onLocationFound={handler.showLocation} />
            </div>
          )}
        </Control>
      </React.Fragment>
    ),
    [geojsonRef, handler]
  );
};

SuburbMap.propTypes = {
  leafletMap: PropTypes.any.isRequired,
};

export default React.memo(SuburbMap);
