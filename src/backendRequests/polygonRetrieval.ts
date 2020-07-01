import * as topojson from 'topojson-client';
import { WithFeatures } from '../interfaces';
import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';

const fetchPolygonData = async (fileName: string) => {
  const response = (await axios.get<TopoJSON.Topology<TopoJSON.Objects<GeoJSON.GeoJsonProperties>> | GeoJSON.GeoJsonObject>(process.env.PUBLIC_URL + '/geo/' + fileName)).data;
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

const withPromiseTracking = async (fileName: string) => await trackPromise(fetchPolygonData(fileName), polygonRetrievalPromiseTrackerArea);

export default withPromiseTracking;
