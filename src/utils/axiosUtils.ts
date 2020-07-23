import axios, { Method } from 'axios';
import { trackPromise } from 'react-promise-tracker';

export default class AxiosUtils {
  static async fetch<T>(url: string, method: Method = 'get', data?: any) {
    console.log(`Fetching ${url}...`);

    const CancelToken = axios.CancelToken;
    let source = CancelToken.source();
    source && source.cancel(`${url} canceled due to new request`);
    source = axios.CancelToken.source();

    return await axios
      .request<T[]>({ url: url, method: method, data: data, cancelToken: source.token })
      .then((response) => {
        const data = response.data;
        console.log(`Got data for ${url}`);
        if (!data.length) {
          console.log('No data');
        }
        return data;
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log(`Cancelled: ${url}`);
        } else {
          console.error(`Cannot get ${url}: ${err}`);
        }
        return null;
      });
  }

  static async fetchWithPromiseTracking<T>(promiseTrackerArea: string, url: string, method: Method = 'get', data?: any) {
    return await trackPromise(AxiosUtils.fetch<T>(url, method, data), promiseTrackerArea);
  }
}
