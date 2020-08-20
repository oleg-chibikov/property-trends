import { debounce, useTheme } from '@material-ui/core';
import { Layer, LeafletEvent, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { Dispatch, useCallback, useEffect, useMemo, useState } from 'react';
import { Map, ScaleControl, TileLayer, ZoomControl } from 'react-leaflet';
import { BoxZoomControl } from 'react-leaflet-box-zoom';
import { useDispatch, useSelector } from 'react-redux';
import fetchSuburbPolygons from '../../backendRequests/suburbPolygonRetrieval';
import GlobalEventHelper from '../../utils/globalEventHelper';
import MapUtils from '../../utils/mapUtils';
import CurrentLocationMarker from '../currentLocation/CurrentLocationMarker';
import { setIsCurrentLocationSearchPaused } from '../currentLocation/currentLocationSlice';
import { checkStatesAndDistricts, selectDistrictListExpanded } from '../districtList/districtListSlice';
import { selectFiltersExpanded } from '../filters/filtersSlice';
import SuburbMap from '../suburbMap/SuburbMap';
import MapConstants from './mapConstants';

let lastZoom = 15;
let dispatch: Dispatch<any>;

const triggerDistrictsReloadForUserInitiatedEvent = (event: LeafletEvent) => {
  if (!GlobalEventHelper.isProgrammaticEvent) {
    // Trigger reloading districts according to viewport only for user-initiated events
    loadRegionsInViewport(event.target as LeafletMap);
  }
};

const loadRegionsInViewport = async (map: LeafletMap) => {
  if (lastZoom < MapConstants.loadDistrictsZoom) {
    return;
  }
  const bounds = map.getBounds();
  const northWest = bounds.getNorthWest();
  const southEast = bounds.getSouthEast();

  const districtsByBoundingBox = await fetchSuburbPolygons(northWest.lng, northWest.lat, southEast.lng, southEast.lat);
  if (districtsByBoundingBox) {
    console.log('Applying new districts from viewport...');
    dispatch(checkStatesAndDistricts(districtsByBoundingBox));
  }
};

const onMapZoomStart = (event: LeafletEvent) => {
  console.log('Starting zooming...');
  dispatch(setIsCurrentLocationSearchPaused(true));
};

const onMapDragStart = async (event: LeafletEvent) => {
  console.log('Starting dragging...');
};

const onMapDragEnd = async (event: LeafletEvent) => {
  console.log('Finished dragging');
  triggerDistrictsReloadForUserInitiatedEvent(event);
};

const onMapZoomEnd = (event: LeafletEvent) => {
  console.log('Finished zooming');
  dispatch(setIsCurrentLocationSearchPaused(false));
  const map = event.target as LeafletMap;
  const zoom = map.getZoom();
  if (zoom < MapConstants.tooltipZoom && lastZoom >= MapConstants.tooltipZoom) {
    console.log('Closing tooltips...');
    map.eachLayer(function (layer: Layer) {
      if (layer.getTooltip) {
        const toolTip = layer.getTooltip();
        if (toolTip) {
          map.closeTooltip(toolTip);
        }
      }
    });
  } else if (zoom >= MapConstants.tooltipZoom && lastZoom < MapConstants.tooltipZoom) {
    console.log('Opening tooltips...');
    map.eachLayer(function (layer: Layer) {
      if (layer.getTooltip) {
        const toolTip = layer.getTooltip();
        if (toolTip) {
          map.openTooltip(toolTip);
        }
      }
    });
  }
  lastZoom = zoom;
  triggerDistrictsReloadForUserInitiatedEvent(event);
};

const RealEstateMap: React.FunctionComponent = () => {
  const [map, setMap] = useState<Map>();
  const filtersExpanded = useSelector(selectFiltersExpanded);
  const districtListExpanded = useSelector(selectDistrictListExpanded);
  const theme = useTheme();
  dispatch = useDispatch();

  const [currentLocation, setCurrentLocation] = useState<[number, number]>();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.log(error.message);
        setCurrentLocation([-33.9613, 151.23]);
      },
      {
        timeout: 1000,
      }
    );
  }, []);

  const maxTransitionTime = Math.max(theme.transitions.duration.enteringScreen, theme.transitions.duration.leavingScreen) + 10;
  useEffect(() => {
    const leafletElement = map?.leafletElement;
    if (leafletElement) {
      MapUtils.redrawMap(leafletElement, maxTransitionTime);
    }
  }, [filtersExpanded, districtListExpanded, map, maxTransitionTime]);

  useEffect(() => {
    const leafletElement = map?.leafletElement;
    if (leafletElement) {
      const handleResize = debounce(() => {
        MapUtils.redrawMap(leafletElement);
      }, 500);
      window.addEventListener('resize', handleResize);
    }
  }, [map]);

  const mapRef = useCallback((node) => {
    if (node) {
      setMap(node);
    }
  }, []);

  return useMemo(() => {
    if (!currentLocation) {
      return null;
    }
    return (
      <Map
        animate={true}
        onzoomstart={onMapZoomStart}
        onzoomend={onMapZoomEnd}
        ondragstart={onMapDragStart}
        ondragend={onMapDragEnd}
        ref={mapRef}
        zoomControl={false}
        attributionControl={false}
        inertia={true}
        preferCanvas={false}
        scrollWheelZoom={true}
        zoom={lastZoom}
        center={currentLocation}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
        <CurrentLocationMarker />
        {map?.leafletElement && <SuburbMap leafletMap={map.leafletElement} />}
        <ScaleControl position="topright" />
        <BoxZoomControl position="bottomright" sticky={false} />
        <ZoomControl position="bottomright" />
      </Map>
    );
  }, [map, mapRef, currentLocation]);
};

export default React.memo(RealEstateMap);
