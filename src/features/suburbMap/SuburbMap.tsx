import Apartment from '@mui/icons-material/Apartment';
import Home from '@mui/icons-material/Home';
import { FeatureCollection, Point } from 'geojson';
import { LatLngBounds, Map, StyleFunction } from 'leaflet';
import React, { Dispatch, useEffect, useMemo, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { GeoJSON } from 'react-leaflet';
import { trackPromise } from 'react-promise-tracker';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import fetchPolygonData from '../../backendRequests/polygonRetrieval';
import fetchPriceData from '../../backendRequests/priceDataSearch';
import usePrevious from '../../hooks/usePrevious';
import { CompoundLayer, CustomLayer, FeatureProperties, MapFilters, NewFeatureProperties, RealEstateResponse, SuburbInfo, WithFeatures, WithMap } from '../../interfaces';
import ColorUtils from '../../utils/colorUtils';
import DomainUtils from '../../utils/domainUtils';
import MapUtils from '../../utils/mapUtils';
import MoneyUtils from '../../utils/moneyUtils';
import StringUtils from '../../utils/stringUtils';
import CurrentLocation from '../currentLocation/CurrentLocation';
import { selectCheckedDistricts, selectUseAdaptiveColors, selectZoomToSelection } from '../districtList/districtListSlice';
import { selectFilters } from '../filters/filtersSlice';
import Info from '../info/Info';
import Legend from '../legend/Legend';
import { changeLegendPricesToColors } from '../legend/legendSlice';
import MapConstants from '../realEstateMap/mapConstants';
import { selectSearchBoxHighlightedSuburb, selectSearchBoxSelectedSuburb } from '../search/searchBoxSlice';
import ShowAll from '../showAll/ShowAll';
import SuburbList from '../suburbList/SuburbList';
import { replaceSuburbsInList, setSuburbColorInList } from '../suburbList/suburbListSlice';
import Control from './Control';
import Highlighter from './highlighter';
import SuburbMapEventHandler from './suburbMapEventHandler';

//TODO: if nothing remembered and user is in Australia - show region around

interface PriceDataBySuburbId {
  [suburbId: string]: RealEstateResponse;
}

let setDistrictsToLoad: (districtsToLoad: string[]) => void;
let useAdaptiveColors: boolean;
let currentFilters: MapFilters;
let isApartment: boolean;
let highlighter: Highlighter;
let eventHandler: SuburbMapEventHandler;
let mapElement: Map;
let bounds: LatLngBounds | undefined;
let geoJsonElement: L.GeoJSON;
let dispatch: Dispatch<unknown>;
let searchBoxSelectedSuburbId: string | undefined;
let searchBoxHighlightedSuburbId: string | undefined;
let zoomToSelection: boolean;
const apartmentHtml = renderToString(<Apartment />);
const houseHtml = renderToString(<Home />);
const priceDataByFileName: { [fileName: string]: PriceDataBySuburbId } = {};
const currentlyCheckedDistricts: { [fileName: string]: number } = {};
const layersBySuburbId: { [suburbId: string]: CustomLayer } = {};
const layersByFileName: { [fileName: string]: CustomLayer[] } = {};
export const processDistrictsPromiseTrackerArea = 'processDistricts';

const colors = ColorUtils.generateColors(24);

const setLayerTooltip = (layer: CustomLayer) => {
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

  // console.log('price for ' + feature?.properties.locality + ': ' + medianPrice || 'not set');
  return {
    fillColor: color ? color : '#ffffff',
    weight: 1,
    opacity: 0.3,
    color: 'dimgray',
    // dashArray: '3',
    fillOpacity: opacity,
  };
};

const applyStyleToLayer = (layer: CustomLayer) => {
  const feature = layer.feature;
  const style = getFeatureStyle(feature);

  // With setTimeout it applies style to layers one by one, otherwise - at once
  setTimeout(() => layer.setStyle(style), 0);
};

const fetchAndApplyPriceData = async (filters: MapFilters, districtFileNames: string[]) => {
  const cleanupLegend = () => {
    console.log(`Cleaning up legend...`);
    return dispatch(changeLegendPricesToColors({}));
  };
  cleanupLegend();
  const getPriceDataForFileName = async (fileName: string) => {
    const cleanupLayers = () => {
      delete priceDataByFileName[fileName];
      const layersForDistrict = layersByFileName[fileName];
      if (layersForDistrict) {
        console.log(`Cleaning up layers for ${fileName}...`);
        for (const layer of layersForDistrict) {
          const properties = layer.feature.properties;
          properties.priceData = undefined;
          applyStyleToLayer(layer);
          setLayerTooltip(layer);
        }
      }
    };
    cleanupLayers();
    const data = await fetchPriceData(filters, DomainUtils.getDistrictNameFromFileName(fileName));
    if (data && data.length) {
      const priceDataForFileName: PriceDataBySuburbId = {};
      priceDataByFileName[fileName] = priceDataForFileName;
      const setSuburbIdsAndPriceData = () => {
        for (const priceData of data) {
          const suburbId = DomainUtils.getSuburbId(priceData.locality, priceData.postCode);
          priceData.suburbId = suburbId;
          priceDataForFileName[suburbId] = priceData;
          const layer = layersBySuburbId[suburbId];
          if (layer) {
            // If layer is already loaded - apply price data for it
            applyPriceDataToLayer(layer, priceData);
            setLayerTooltip(layer);
          }
        }
      };

      setSuburbIdsAndPriceData();
    }
  };

  await Promise.all(districtFileNames.map(getPriceDataForFileName));

  // After priceData was loaded for all the suburbs - it's time to recalculate colors
  console.log('Calculating colors after prices for all districts are loaded...');
  setColors(useAdaptiveColors);
};

const setColors = (useAdaptiveColors: boolean) => {
  let priceDataForAllSuburbs: RealEstateResponse[] = [];
  for (const priceDataForFileName of Object.values(priceDataByFileName)) {
    priceDataForAllSuburbs = priceDataForAllSuburbs.concat(Object.values(priceDataForFileName));
  }

  if (!priceDataForAllSuburbs.length) {
    return;
  }

  const { colorsByPriceInterval, suburbIdsByPriceInterval } = ColorUtils.setColorProperties(useAdaptiveColors, currentFilters, priceDataForAllSuburbs, colors);
  eventHandler.setSuburbIdsByPriceInterval(suburbIdsByPriceInterval);
  dispatch(changeLegendPricesToColors(colorsByPriceInterval));
  for (const priceData of priceDataForAllSuburbs) {
    dispatch(setSuburbColorInList({ suburbId: priceData.suburbId, color: priceData.priceIntrevalInfo.color }));
  }

  console.log('Caclulated colors');

  for (const layer of Object.values(layersBySuburbId)) {
    applyStyleToLayer(layer);
  }
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

  const fileName = properties.fileName;
  const layersForFileName = layersByFileName[fileName] || [];
  layersForFileName.push(layer);
  layersByFileName[fileName] = layersForFileName;
  const suburbId = properties.suburbId;
  layersBySuburbId[suburbId] = layer;

  // If priceData is fetched - the necessary properties and the style should be applied;
  const priceDataForFileName = priceDataByFileName[fileName];
  const priceDataForSuburb = priceDataForFileName ? priceDataForFileName[suburbId] : undefined;
  if (priceDataForSuburb) {
    applyPriceDataToLayer(layer, priceDataForSuburb);
    // No need to apply style here as it is applied natively by Leaflet
  }

  // layer.bindPopup('');
  const tooltipContent = setLayerTooltip(layer);
  layer.bindTooltip(tooltipContent, { permanent: true, direction: 'center', interactive: false, className: 'suburb-tooltip' });
  // For some reason it doesn't work without setTimeout
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
    const newlyAddedDistrictFileNames = Object.keys(checkedDistrictFileNames).filter((districtFileName) => !(districtFileName in currentlyCheckedDistricts));
    if (newlyAddedDistrictFileNames.length) {
      console.log('Getting prices for ' + newlyAddedDistrictFileNames.length + ' new districts...');
      const districtsToFetch = newlyAddedDistrictFileNames;
      setDistrictsToLoad(districtsToFetch);
    } else {
      const removedDistrictsFileNames = Object.keys(currentlyCheckedDistricts).filter((districtFileName) => !(districtFileName in checkedDistrictFileNames));
      if (removedDistrictsFileNames.length) {
        console.log('Recalculating colors as ' + removedDistrictsFileNames.length + ' districts were removed and no districts added...');
        // If nothing was added but some suburbs were removed - recalculate colors.
        // There is no need to recalcuate them if some suburbs were added as they will be recalculated anyway
        if (useAdaptiveColors) {
          setColors(true);
        }
      }
    }
  };

  // Search for prices in parallel with fetching districts
  getPricesForCheckedDistricts();

  const addAndRemoveDistricts = async () => {
    const removeUncheckedLayers = (checkedDistricts: { [fileName: string]: number }) => {
      for (const fileName in priceDataByFileName) {
        if (!(fileName in checkedDistricts)) {
          delete priceDataByFileName[fileName];
        }
      }
      for (const fileName in layersByFileName) {
        if (!(fileName in checkedDistricts)) {
          const innerLayers = layersByFileName[fileName];
          for (const layer of innerLayers) {
            const compoundLayer = geoJsonElement.removeLayer(layer);
            bounds = compoundLayer.getBounds();
          }

          for (const layer of innerLayers) {
            const suburbId = layer.feature.properties.suburbId;
            delete layersBySuburbId[suburbId];
          }
          delete layersByFileName[fileName];
          delete currentlyCheckedDistricts[fileName];
          console.log('Deleted ' + fileName);
        }
      }
    };

    removeUncheckedLayers(checkedDistrictFileNames);
    const addCheckedLayers = async (checkedDistrictFileNames: { [fileName: string]: number }) => {
      const suburbsToDisplay: { [suburbId: string]: SuburbInfo } = {};
      const addInfoToFeatures = (data: WithFeatures, fileName: string) => {
        const readPropertiesFromNewFeature = (properties: NewFeatureProperties) => {
          const name = StringUtils.toTitleCase(properties.name || properties.Name || 'No Title');
          const postCode = parseInt(properties.description);
          return { postCode, name };
        };
        for (const feature of data.features) {
          const { postCode, name } = readPropertiesFromNewFeature(feature.properties as unknown as NewFeatureProperties);

          const properties = feature.properties;
          properties.fileName = fileName;
          const { state, district } = DomainUtils.getStateAndDistrictFromFileName(fileName);
          properties.district = district;
          properties.state = state;
          properties.postCode = postCode;
          const suburbId = DomainUtils.getSuburbId(name, postCode);
          properties.locality = name;
          properties.suburbId = suburbId;
          suburbsToDisplay[suburbId] = {
            name,
            suburbId,
          };

          // Setting prices for new features when prices are already fetched and new layer is added
          const priceDataForFileName = priceDataByFileName[fileName];
          properties.priceData = priceDataForFileName ? priceDataForFileName[suburbId] : undefined;
        }
      };

      for (const districtFileName in checkedDistrictFileNames) {
        if (districtFileName in currentlyCheckedDistricts) {
          //TODO: put comment
          for (const layer of layersByFileName[districtFileName]) {
            const name = layer.feature.properties.locality;
            const suburbId = layer.feature.properties.suburbId;
            suburbsToDisplay[suburbId] = {
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

        // This object contains all the layers, not just recently added
        const compoundLayer = geoJsonElement.addData(data as unknown as GeoJSON.GeoJsonObject) as unknown as CompoundLayer;
        bounds = compoundLayer.getBounds();
        currentlyCheckedDistricts[districtFileName] = 0;
        console.log('Added polygons for ' + districtFileName);
      }

      dispatch(replaceSuburbsInList(suburbsToDisplay));
    };

    await addCheckedLayers(checkedDistrictFileNames);
    // SearchBox requires a new file to be loaded - select here and show selected suburb
    if (zoomToSelection && !eventHandler.onSearchBoxSelectedItemChange(searchBoxSelectedSuburbId)) {
      eventHandler.showBounds(bounds);
    }

    MapUtils.redrawMap(mapElement);
  };

  const processDistrictsWithPromiseTracking = async () => await trackPromise(addAndRemoveDistricts(), processDistrictsPromiseTrackerArea);

  await processDistrictsWithPromiseTracking();
};

const emptyGeoJSON: FeatureCollection<Point> = {
  type: 'FeatureCollection',
  features: [],
};

const SuburbMap: React.FunctionComponent<WithMap> = ({ leafletMap }) => {
  mapElement = leafletMap;
  const [handler, setHandler] = useState<SuburbMapEventHandler>();
  const [districtFileNamesToLoad, setDistrictFileNamesToLoad] = useState<string[]>([]);
  setDistrictsToLoad = setDistrictFileNamesToLoad;
  dispatch = useDispatch<AppDispatch>();
  const checkedDistrictFileNames = useSelector(selectCheckedDistricts);
  const useAdaptive = useSelector(selectUseAdaptiveColors);
  useAdaptiveColors = useAdaptive;
  const filters = useSelector(selectFilters);
  currentFilters = filters;
  zoomToSelection = useSelector(selectZoomToSelection);
  const supportsMouse = window.matchMedia('(hover: hover)').matches;
  // This is used to display proper icon in tooltips
  isApartment = filters.propertyType === 'apartment';
  searchBoxSelectedSuburbId = useSelector(selectSearchBoxSelectedSuburb);
  searchBoxHighlightedSuburbId = useSelector(selectSearchBoxHighlightedSuburb);
  const previousSearchBoxHighlightedSuburbId = searchBoxHighlightedSuburbId;
  const previousSearchBoxSelectedSuburbId = searchBoxSelectedSuburbId;
  const prevDistrictFileNamesToLoad = usePrevious(districtFileNamesToLoad);
  const prevFilters = usePrevious(filters);

  useEffect(() => {
    processCheckedDistricts(checkedDistrictFileNames);
  }, [checkedDistrictFileNames]);

  useEffect(() => {
    const districtsChanged = JSON.stringify(districtFileNamesToLoad) !== JSON.stringify(prevDistrictFileNamesToLoad);
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(prevFilters);
    if (!filtersChanged && !districtsChanged) {
      return;
    }

    fetchAndApplyPriceData(filters, districtsChanged ? districtFileNamesToLoad : Object.keys(currentlyCheckedDistricts));
  }, [filters, districtFileNamesToLoad, prevDistrictFileNamesToLoad, prevFilters]);

  useEffect(() => {
    setColors(useAdaptive);
  }, [useAdaptive]);

  const geoJSONRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    // Access the Leaflet GeoJSON layer instance through the ref
    const geoJSONLayer = geoJSONRef.current;

    if (geoJSONLayer) {
      // Perform actions when the GeoJSON layer is ready
      console.log('GeoJSON layer is ready:', geoJSONLayer);
      geoJsonElement = geoJSONLayer;
      highlighter = new Highlighter(dispatch, geoJsonElement);
      setHandler(new SuburbMapEventHandler(supportsMouse, dispatch, mapElement, highlighter, layersBySuburbId));
    }
  }, [geoJSONRef, supportsMouse]);

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
        <GeoJSON
          style={getFeatureStyle}
          ref={(geoJSON) => {
            if (geoJSON) {
              geoJSONRef.current = geoJSON;
            }
          }}
          data={emptyGeoJSON}
          onEachFeature={onEachFeature}
        />
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
    [geoJSONRef, handler]
  );
};

export default React.memo(SuburbMap);

function applyPriceDataToLayer(layer: CustomLayer, priceData: RealEstateResponse) {
  layer.feature.properties.priceData = priceData;
  if (priceData.suburbId === searchBoxSelectedSuburbId) {
    highlighter.highlightLayer(layer);
  }
}
