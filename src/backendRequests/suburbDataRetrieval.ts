import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import { MapFilters, RealEstateEntry } from '../interfaces';
import DomainUtils from '../utils/domainUtils';

const fetchData = async (filters: MapFilters, postCode: number, locality: string) => {
  const filtersUrl = DomainUtils.getFiltersUrl(filters);
  const url = process.env.REACT_APP_PRICES_API_URL + `RealEstate?postCode=${postCode}&locality=${locality}&${filtersUrl}`;
  console.log(`Fetching ${url}...`);

  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  source && source.cancel('Operation canceled due to new request.');
  source = axios.CancelToken.source();

  return await axios
    .get<RealEstateEntry[]>(url, { cancelToken: source.token })
    .then((priceDataResponse) => {
      const data = priceDataResponse.data;
      console.log('Got suburb data');
      if (!data.length) {
        console.log('No data');
      }
      return data;
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        console.log(`Cancelled: ${url}`);
      } else {
        console.error('Cannot get suburb data: ' + err);
      }
      return null;
    });
};

export const suburbDataRetrievalPromiseTrackerArea = 'suburbData';

const withPromiseTracking = async (filters: MapFilters, postCode: number, locality: string) => await trackPromise(fetchData(filters, postCode, locality), suburbDataRetrievalPromiseTrackerArea);

export default withPromiseTracking;
