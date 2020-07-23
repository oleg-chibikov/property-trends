import AxiosUtils from '../utils/axiosUtils';

const fetchData = async () => {
  const url = process.env.REACT_APP_PRICES_API_URL + 'Districts/';
  return await AxiosUtils.fetchWithPromiseTracking<string>(districtListRetrievalPromiseTrackerArea, url);
};

export const districtListRetrievalPromiseTrackerArea = 'districtList';

export default fetchData;
