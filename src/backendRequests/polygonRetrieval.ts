import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import * as topojson from 'topojson-client';
import { WithFeatures } from '../interfaces';

const fetchData = async (fileName: string) => {
  const response = (
    await axios.get<TopoJSON.Topology<TopoJSON.Objects<GeoJSON.GeoJsonProperties>> | GeoJSON.GeoJsonObject>('https://raw.githubusercontent.com/oleg-chibikov/australian_suburbs/master/Distributed/TopoJSON.Simplified/' + fileName)
  ).data;
  console.log('Got polygons for ' + fileName);
  const data: WithFeatures[] = [];
  if (response.type === 'Topology') {
    for (const key in response.objects) {
      const geojsonData = topojson.feature(response, response.objects[key]);
      data.push(geojsonData as WithFeatures);
    }
  } else {
    data.push(response as WithFeatures);
  }
  return data;
};

export const polygonRetrievalPromiseTrackerArea = 'polygon';

const withPromiseTracking = async (fileName: string) => await trackPromise(fetchData(fileName), polygonRetrievalPromiseTrackerArea);

export default withPromiseTracking;
