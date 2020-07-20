import { debounce, useTheme } from '@material-ui/core';
import { Layer, LeafletEvent, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { Dispatch, useCallback, useEffect, useMemo, useState } from 'react';
import { Map, ScaleControl, TileLayer, ZoomControl } from 'react-leaflet';
import { BoxZoomControl } from 'react-leaflet-box-zoom';
import { useDispatch, useSelector } from 'react-redux';
import MapUtils from '../../utils/mapUtils';
import CurrentLocationMarker from '../currentLocation/CurrentLocationMarker';
import { setIsPaused } from '../currentLocation/currentLocationSlice';
import { selectExpanded as selectDistrictListExpanded } from '../districtList/districtListSlice';
import { selectExpanded as selectFiltersExpanded } from '../filters/filtersSlice';
import MapConstants from './mapConstants';
import './RealEstateMap.module.css';
import SuburbMap from './SuburbMap';

let lastZoom: number;
let dispatch: Dispatch<any>;

const onMapZoomStart = (event: LeafletEvent) => {
  dispatch(setIsPaused(true));
};

const onMapZoomEnd = (event: LeafletEvent) => {
  dispatch(setIsPaused(false));
  const map = event.target as LeafletMap;
  const zoom = map.getZoom();
  if (zoom < MapConstants.tooltipZoom && (!lastZoom || lastZoom >= MapConstants.tooltipZoom)) {
    console.log('Closing tooltips');
    map.eachLayer(function (layer: Layer) {
      if (layer.getTooltip) {
        const toolTip = layer.getTooltip();
        if (toolTip) {
          map.closeTooltip(toolTip);
        }
      }
    });
  } else if (zoom >= MapConstants.tooltipZoom && (!lastZoom || lastZoom < MapConstants.tooltipZoom)) {
    console.log('Opening tooltips');
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
        ref={mapRef}
        zoomControl={false}
        attributionControl={false}
        inertia={true}
        preferCanvas={false}
        scrollWheelZoom={true}
        zoom={15}
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
