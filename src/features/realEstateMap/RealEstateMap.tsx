import { debounce, useTheme } from '@mui/material';
import { Layer, LeafletEvent, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { Dispatch, FunctionComponent, useEffect, useMemo, useState } from 'react';
import { MapContainer, ScaleControl, TileLayer, useMapEvents, ZoomControl } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import fetchSuburbPolygons from '../../backendRequests/suburbPolygonRetrieval';
import GlobalEventHelper from '../../utils/globalEventHelper';
import MapUtils from '../../utils/mapUtils';
import CurrentLocationMarker from '../currentLocation/CurrentLocationMarker';
import { setIsCurrentLocationSearchPaused } from '../currentLocation/currentLocationSlice';
import { checkStatesAndDistricts, selectDistrictListExpanded } from '../districtList/districtListSlice';
import { selectFiltersExpanded } from '../filters/filtersSlice';
import SuburbMap from '../suburbMap/SuburbMap';
import BoxZoomControl from './BoxZoomControl';
import MapConstants from './mapConstants';

let lastZoom = 15;
let dispatch: Dispatch<unknown>;

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

const RealEstateMap: React.FunctionComponent = () => {
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
  return useMemo(() => {
    if (!currentLocation) {
      return null;
    }
    return (
      <MapContainer zoomControl={false} attributionControl={false} inertia={true} preferCanvas={false} scrollWheelZoom={true} zoom={lastZoom} center={currentLocation}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
        <CurrentLocationMarker />
        <ScaleControl position="topright" />
        {/* <BoxZoomControl position="bottomright" sticky={false} /> TODO: Implement as this one is outdated */}
        <ZoomControl position="bottomright" />
        <MapEvents />
      </MapContainer>
    );
  }, [currentLocation]);
};

const MapEvents: FunctionComponent = () => {
  const triggerDistrictsReloadForUserInitiatedEvent = (event: LeafletEvent) => {
    if (!GlobalEventHelper.isProgrammaticEvent) {
      // Trigger reloading districts according to viewport only for user-initiated events
      loadRegionsInViewport(event.target as LeafletMap);
    }
  };

  const onMapZoomStart = (event: LeafletEvent) => {
    console.log('Starting zooming...');
    dispatch(setIsCurrentLocationSearchPaused(true));
  };

  const onMapMoveStart = async (event: LeafletEvent) => {
    console.log('Starting moving...');
  };

  const onMapMoveEnd = async (event: LeafletEvent) => {
    triggerDistrictsReloadForUserInitiatedEvent(event);
    console.log('Finished moving');
  };

  const onMapZoomEnd = (event: LeafletEvent) => {
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
    console.log('Finished zooming');
  };
  const map = useMapEvents({
    zoomstart(e) {
      onMapZoomStart(e);
    },
    zoomend(e) {
      onMapZoomEnd(e);
    },
    movestart(e) {
      onMapMoveStart(e);
    },
    moveend(e) {
      onMapMoveEnd(e);
    },
  });
  const filtersExpanded = useSelector(selectFiltersExpanded);
  const districtListExpanded = useSelector(selectDistrictListExpanded);
  const theme = useTheme();
  dispatch = useDispatch<AppDispatch>();

  const maxTransitionTime = Math.max(theme.transitions.duration.enteringScreen, theme.transitions.duration.leavingScreen) + 10;
  useEffect(() => {
    if (map) {
      MapUtils.redrawMap(map, maxTransitionTime);
    }
  }, [filtersExpanded, districtListExpanded, map, maxTransitionTime]);

  useEffect(() => {
    const leafletElement = map;
    if (leafletElement) {
      const handleResize = debounce(() => {
        MapUtils.redrawMap(leafletElement);
      }, 500);
      window.addEventListener('resize', handleResize);
    }
  }, [map]);
  return (
    map && (
      <>
        <BoxZoomControl position="bottomright" leafletMap={map} />
        <SuburbMap leafletMap={map} />
      </>
    )
  );
};

export default React.memo(RealEstateMap);
