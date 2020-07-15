import axios from 'axios';
import debounce from 'debounce-async';
import { trackPromise } from 'react-promise-tracker';
import { MapFilters } from '../features/filters/filtersSlice';
import { RealEstateResponse } from '../interfaces';

const fetchData = async (filters: MapFilters) => {
  if (!filters.districts.length) {
    return [];
  }

  const getMinValue = (value: number | number[]) => {
    return Array.isArray(value) ? value[0] : value;
  };

  const getMaxValue = (value: number | number[]) => {
    return Array.isArray(value) ? value[1] : value;
  };

  const constructionStatus = filters.constructionStatus === 'any' ? '' : filters.constructionStatus;
  const bedroomsMin = getMinValue(filters.bedrooms);
  const bedroomsMax = getMaxValue(filters.bedrooms);
  const bathroomsMin = getMinValue(filters.bathrooms);
  const bathroomsMax = getMaxValue(filters.bathrooms);
  const parkingSpacesMin = getMinValue(filters.parkingSpaces);
  const parkingSpacesMax = getMaxValue(filters.parkingSpaces);
  const isRent = filters.dealType === 'rent';
  const url =
    process.env.REACT_APP_PRICES_API_URL +
    `RealEstate?isRent=${isRent}&propertyTypes=${filters.propertyType}&constructionStatus=${constructionStatus}&allowedWindowInDays=${filters.allowedWindowInDays}&mainPriceOnly=${
      filters.mainPriceOnly || false
    }&bedroomsMin=${bedroomsMin}&bedroomsMax=${bedroomsMax}&bathroomsMin=${bathroomsMin}&bathroomsMax=${bathroomsMax}&parkingSpacesMin=${parkingSpacesMin}&parkingSpacesMax=${parkingSpacesMax}`;
  console.log(`Fetching ${url}...`);

  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  source && source.cancel('Operation canceled due to new request.');
  source = axios.CancelToken.source();

  return await axios
    .post<RealEstateResponse[]>(url, filters.districts, { cancelToken: source.token })
    .then((priceDataResponse) => {
      const data = priceDataResponse.data;
      console.log('Got prices');
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
        console.error('Cannot get prices: ' + err);
      }
      return [];
    });
};

export const priceDataSearchPromiseTrackerArea = 'price';

const withPromiseTracking = async (filters: MapFilters) => await trackPromise(fetchData(filters), priceDataSearchPromiseTrackerArea);

const debounced = debounce(withPromiseTracking, 400);

export default debounced;
