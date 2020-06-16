import React, { useMemo } from 'react';
import './RealEstateMap.module.css';
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import FeatureMap from '../featureMap/FeatureMap';

const RealEstateMap: React.FunctionComponent = () => {
  const [json, setJson] = React.useState<GeoJSON.GeoJsonObject>();

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        process.env.PUBLIC_URL + '/geo/arthur river.geojson'
      );
      setJson(await response.json());
    };
    fetchData();
  }, []);

  return useMemo(
    () => (
      <Map
        inertia={true}
        preferCanvas={true}
        zoom={17}
        center={[-33.9613, 151.23]}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {json && <FeatureMap json={json} />}
      </Map>
    ),
    [json]
  );
};

export default RealEstateMap;
