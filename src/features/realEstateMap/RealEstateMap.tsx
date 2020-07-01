import './RealEstateMap.module.css';
import 'leaflet/dist/leaflet.css';
import { BoxZoomControl } from 'react-leaflet-box-zoom';
import { Map, TileLayer } from 'react-leaflet';
import FeatureMap from './FeatureMap';
import React, { useCallback, useState } from 'react';

const RealEstateMap: React.FunctionComponent = () => {
  const [map, setMap] = useState<Map>();
  const ref = useCallback((node) => {
    if (node !== null) {
      setMap(node);
    }
  }, []);

  return (
    <Map ref={ref} zoomControl={false} inertia={true} preferCanvas={true} zoom={17} center={[-33.9613, 151.23]}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
      {map?.leafletElement && <FeatureMap leafletMap={map.leafletElement} />}
      <BoxZoomControl position="bottomright" sticky={true} />
    </Map>
  );
};
export default React.memo(RealEstateMap);
