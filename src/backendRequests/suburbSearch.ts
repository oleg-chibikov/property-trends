import { PostCodeFileInfo } from '../interfaces';
import { trackPromise } from 'react-promise-tracker';
import axios, { CancelTokenSource } from 'axios';
import debounce from 'debounce-async';

let cancellationTokenSource: CancelTokenSource | undefined;

const fetchDistrictInfo = async (searchPattern: string) => {
  const url = process.env.REACT_APP_PRICES_API_URL + `Districts/${searchPattern}`;
  console.log(`Searching for suburbs: ${url}...`);

  if (cancellationTokenSource) {
    cancellationTokenSource.cancel();
  }
  const CancelToken = axios.CancelToken;
  cancellationTokenSource = CancelToken.source();
  return await axios
    .get<PostCodeFileInfo[]>(url, { cancelToken: cancellationTokenSource.token })
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
