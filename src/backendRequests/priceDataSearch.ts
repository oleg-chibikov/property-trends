import debounce from 'debounce-async';
import { MapFilters, RealEstateResponse } from '../interfaces';
import AxiosUtils from '../utils/axiosUtils';
import DomainUtils from '../utils/domainUtils';

const fetchData = async (filters: MapFilters, districts: string[]) => {
  if (!districts.length) {
    console.log('District filters are empty');
    return null;
  }

  const filtersUrl = DomainUtils.getFiltersUrl(filters);
  const url = process.env.REACT_APP_PRICES_API_URL + `Prices?${filtersUrl}`;

  return await AxiosUtils.fetchWithPromiseTracking<RealEstateResponse>(priceDataSearchPromiseTrackerArea, url, 'post', districts);
};

export const priceDataSearchPromiseTrackerArea = 'price';

const debounced = debounce(fetchData, 400);

export default debounced;
