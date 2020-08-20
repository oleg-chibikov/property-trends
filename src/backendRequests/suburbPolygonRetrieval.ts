import { StateAndDistrict } from '../interfaces';
import AxiosUtils from '../utils/axiosUtils';

const fetchData = async (x1: number, y1: number, x2: number, y2: number) => {
  const url = process.env.REACT_APP_PRICES_API_URL + `Suburbs?x1=${x1}&y1=${y1}&x2=${x2}&y2=${y2}`;
  return await AxiosUtils.fetchWithPromiseTracking<StateAndDistrict>(suburbPolygonRetrievalPromiseTrackerArea, url);
};

export const suburbPolygonRetrievalPromiseTrackerArea = 'suburbPolygon';

export default fetchData;
