import { Layer, LeafletEvent, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useCallback, useState } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import { BoxZoomControl } from 'react-leaflet-box-zoom';
import MapConstants from './mapConstants';
import './RealEstateMap.module.css';
import SuburbMap from './SuburbMap';

let lastZoom: number;

const onMapZoomEnd = (event: LeafletEvent) => {
  const map = event.target as LeafletMap;
  const zoom = map.getZoom();
  if (zoom < MapConstants.tooltipZoom && (!lastZoom || lastZoom >= MapConstants.tooltipZoom)) {
    map.eachLayer(function (layer: Layer) {
      if (layer.getTooltip) {
        const toolTip = layer.getTooltip();
        if (toolTip) {
          map.closeTooltip(toolTip);
        }
      }
    });
  } else if (zoom >= MapConstants.tooltipZoom && (!lastZoom || lastZoom < MapConstants.tooltipZoom)) {
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
  const ref = useCallback((node) => {
    if (node !== null) {
      setMap(node);
    }
  }, []);

  return (
    <Map onzoomend={onMapZoomEnd} ref={ref} zoomControl={false} inertia={true} preferCanvas={true} scrollWheelZoom={true} zoom={17} center={[-33.9613, 151.23]}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
      {map?.leafletElement && <SuburbMap leafletMap={map.leafletElement} />}
      <BoxZoomControl position="bottomright" sticky={true} />
    </Map>
  );
};
export default React.memo(RealEstateMap);
