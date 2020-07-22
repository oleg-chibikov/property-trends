import { MapFilters } from '../interfaces';
import StringUtils from './stringUtils';

export default class DomainUtils {
  static removePostfix = (str: string) => str.replace(/\..*/, '');

  static padPostCode = (postCode: number) => {
    const str = '' + postCode;
    const pad = '0000';
    return pad.substring(0, pad.length - str.length) + str;
  };

  static getSuburbId = (locality: string, postCode: number) => StringUtils.removeNonAlphaNumberic(locality).toLowerCase() + '_' + postCode;

  static getDistrictNameFromFileName = (fileName: string) => {
    const startingPosition = fileName.indexOf(' - ') + 3;
    const endingPosition = fileName.indexOf('.', startingPosition);
    return fileName.substring(startingPosition, endingPosition);
  };

  static getStateAndDistrictFromFileName = (fileName: string) => {
    const stateStartingPosition = 0;
    const stateEndingPosition = fileName.indexOf(' - ');
    const districtStartingPosition = stateEndingPosition + 3;
    const districtEndingPosition = fileName.indexOf('.', stateEndingPosition);
    return { state: fileName.substring(stateStartingPosition, stateEndingPosition), district: fileName.substring(districtStartingPosition, districtEndingPosition) };
  };

  static getRealEstateSuburbUri = (locality: string, formattedPostCode: string, state: string) => `https://www.realestate.com.au/neighbourhoods/${locality}-${formattedPostCode}-${state}`;

  static getRealEstatePropertyUri = (id: number) => `https://www.realestate.com.au/${id}`;

  static getFiltersUrl = (filters: MapFilters) => {
    const getMinValue = (value: number | number[]) => {
      return Array.isArray(value) ? value[0] : value;
    };

    const getMaxValue = (value: number | number[]) => {
      return Array.isArray(value) ? value[1] : value;
    };

    const constructionStatus = filters.constructionStatus;
    const bedroomsMin = getMinValue(filters.bedrooms);
    const bedroomsMax = getMaxValue(filters.bedrooms);
    const bathroomsMin = getMinValue(filters.bathrooms);
    const bathroomsMax = getMaxValue(filters.bathrooms);
    const parkingSpacesMin = getMinValue(filters.parkingSpaces);
    const parkingSpacesMax = getMaxValue(filters.parkingSpaces);
    const isRent = filters.dealType === 'rent';

    return `isRent=${isRent}&propertyType=${filters.propertyType}&constructionStatus=${constructionStatus}&allowedWindowInDays=${filters.allowedWindowInDays}&mainPriceOnly=${
      filters.mainPriceOnly || false
    }&bedroomsMin=${bedroomsMin}&bedroomsMax=${bedroomsMax}&bathroomsMin=${bathroomsMin}&bathroomsMax=${bathroomsMax}&parkingSpacesMin=${parkingSpacesMin}&parkingSpacesMax=${parkingSpacesMax}`;
  };
}
