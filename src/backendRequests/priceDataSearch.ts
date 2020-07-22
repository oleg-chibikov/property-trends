import axios from 'axios';
import debounce from 'debounce-async';
import { trackPromise } from 'react-promise-tracker';
import { MapFilters, RealEstateResponse } from '../interfaces';
import DomainUtils from '../utils/domainUtils';

const fetchData = async (filters: MapFilters, districts: string[]) => {
  if (!districts.length) {
    console.log('District filters are empty');
    return null;
  }

  const filtersUrl = DomainUtils.getFiltersUrl(filters);
  const url = process.env.REACT_APP_PRICES_API_URL + `RealEstate?${filtersUrl}`;
  console.log(`Fetching ${url}...`);

  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  source && source.cancel('Operation canceled due to new request.');
  source = axios.CancelToken.source();

  return await axios
    .post<RealEstateResponse[]>(url, districts, { cancelToken: source.token })
    .then((priceDataResponse) => {
      const data = priceDataResponse.data;
      console.log('Got prices');
      if (!data.length) {
        console.log('No data');
      }
      return data;
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        console.log(`Cancelled: ${url}`);
      } else {
        console.error('Cannot get prices: ' + err);
      }
      return null;
    });
};

export const priceDataSearchPromiseTrackerArea = 'price';

const withPromiseTracking = async (filters: MapFilters, districts: string[]) => await trackPromise(fetchData(filters, districts), priceDataSearchPromiseTrackerArea);

const debounced = debounce(withPromiseTracking, 400);

export default debounced;
