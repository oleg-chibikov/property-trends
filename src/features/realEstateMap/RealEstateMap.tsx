import React, { useMemo, useEffect } from 'react';
import './RealEstateMap.module.css';
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import FeatureMap from '../featureMap/FeatureMap';
import axios from 'axios';

const RealEstateMap: React.FunctionComponent = () => {
  const [polygonData, setPolygonData] = React.useState<GeoJSON.GeoJsonObject>();

  useEffect(() => {
    const fetchPolygonData = async () => {
      const response = await axios.get<GeoJSON.GeoJsonObject>(
        process.env.PUBLIC_URL + '/geo/act.geojson'
      );
      setPolygonData(response.data);
    };
    fetchPolygonData();
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
        {polygonData && <FeatureMap polygonData={polygonData} />}
      </Map>
    ),
    [polygonData]
  );
};

export default RealEstateMap;
