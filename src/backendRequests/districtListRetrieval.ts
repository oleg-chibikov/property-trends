import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';

const fetchData = async () => {
  const url = process.env.REACT_APP_PRICES_API_URL + 'Districts/';
  console.log(`Fetching ${url}...`);

  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  source && source.cancel('Operation canceled due to new request.');
  source = axios.CancelToken.source();

  return await axios
    .get<string[]>(url, { cancelToken: source.token })
    .then((response) => {
      const data = response.data;
      console.log('Got district list');
      if (!data.length) {
        console.log('No data');
      }
      return data;
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        console.log(`Cancelled: ${url}`);
      } else {
        console.error('Cannot get district list: ' + err);
      }
      return null;
    });
};

export const districtListRetrievalPromiseTrackerArea = 'districtList';

const withPromiseTracking = async () => await trackPromise(fetchData(), districtListRetrievalPromiseTrackerArea);

export default withPromiseTracking;
