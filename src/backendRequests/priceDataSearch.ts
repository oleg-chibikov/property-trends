import { FiltersState } from '../features/filters/filtersSlice';
import { RealEstateResponse } from '../interfaces';
import { trackPromise } from 'react-promise-tracker';
import axios, { CancelTokenSource } from 'axios';
import debounce from 'debounce-async';

let cancellationTokenSource: CancelTokenSource | undefined;

const fetchPriceData = async (filters: FiltersState) => {
  if (!filters.postCodes.length) {
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
  if (cancellationTokenSource) {
    cancellationTokenSource.cancel();
  }
  const CancelToken = axios.CancelToken;
  cancellationTokenSource = CancelToken.source();

  return await axios
    .post<RealEstateResponse[]>(url, filters.postCodes, { cancelToken: cancellationTokenSource.token })
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

const withPromiseTracking = async (filters: FiltersState) => await trackPromise(fetchPriceData(filters), priceDataSearchPromiseTrackerArea);

const fetchPriceDataDebounced = debounce(withPromiseTracking, 400);

export default fetchPriceDataDebounced;
