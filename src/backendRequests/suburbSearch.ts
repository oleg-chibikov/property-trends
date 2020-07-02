import axios from 'axios';
import debounce from 'debounce-async';
import { trackPromise } from 'react-promise-tracker';
import { PostCodeFileInfo } from '../interfaces';

const fetchDistrictInfo = async (searchPattern: string) => {
  if (!searchPattern && !searchPattern.length) {
    return [];
  }
  const url = process.env.REACT_APP_PRICES_API_URL + `Districts/${searchPattern}`;
  console.log(`Searching for suburbs: ${url}...`);

  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  source && source.cancel('Operation canceled due to new request.');
  source = axios.CancelToken.source();

  return await axios
    .get<PostCodeFileInfo[]>(url, { cancelToken: source.token })
    .then((priceDataResponse) => {
      const data = priceDataResponse.data;
      console.log('Got suburb search results');
      if (!data.length) {
        console.log('No data');
        return [];
      }
      return data;
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        console.log(`Cancelled: ${url}`);
      } else {
        console.error('Cannot get suburb search results: ' + err);
      }
      return [];
    });
};

export const suburbSearchPromiseTrackerArea = 'suburbs';

const withPromiseTracking = async (searchPattern: string) => await trackPromise(fetchDistrictInfo(searchPattern), suburbSearchPromiseTrackerArea);

const fetchDistrictInfoDebounced = debounce(withPromiseTracking, 400);

export default fetchDistrictInfoDebounced;
