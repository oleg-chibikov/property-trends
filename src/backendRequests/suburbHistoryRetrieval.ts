import { HistoryEntry, MapFilters } from '../interfaces';
import AxiosUtils from '../utils/axiosUtils';
import DomainUtils from '../utils/domainUtils';

const fetchData = async (filters: MapFilters, state: string, postCode: number, locality: string) => {
  const filtersUrl = DomainUtils.getFiltersUrl(filters);
  const url = process.env.REACT_APP_PRICES_API_URL + `RealEstateHistory?state=${state}&postCode=${postCode}&locality=${locality}&${filtersUrl}`;

  return await AxiosUtils.fetchWithPromiseTracking<HistoryEntry>(suburbDataRetrievalPromiseTrackerArea, url);
};

export const suburbDataRetrievalPromiseTrackerArea = 'suburbHistory';

export default fetchData;
