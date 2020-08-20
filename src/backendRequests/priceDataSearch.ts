import { MapFilters, RealEstateResponse } from '../interfaces';
import AxiosUtils from '../utils/axiosUtils';
import DomainUtils from '../utils/domainUtils';

const fetchData = async (filters: MapFilters, district: string) => {
  const filtersUrl = DomainUtils.getFiltersUrlParams(filters);
  const url = process.env.REACT_APP_PRICES_API_URL + `Prices?district=${encodeURIComponent(district)}&${filtersUrl}`;

  return await AxiosUtils.fetchWithPromiseTracking<RealEstateResponse>(priceDataSearchPromiseTrackerArea, url, 'get', district);
};

export const priceDataSearchPromiseTrackerArea = 'price';

export default fetchData;
