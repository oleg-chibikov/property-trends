import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { MapFilters } from '../../interfaces';

const defaultRange: number[] = [0, 7];

interface FiltersState {
  filters: MapFilters;
  districtsToLoad: string[];
  expanded: boolean;
}

const initialState: FiltersState = {
  filters: { propertyType: 'apartment', dealType: 'buy', bedrooms: [2, 2], bathrooms: defaultRange, parkingSpaces: defaultRange, constructionStatus: 'any', allowedWindowInDays: 7, mainPriceOnly: true, includeSold: false },
  expanded: false,
  districtsToLoad: [],
};

export const FiltersSlice = createSlice({
  name: 'Filters',
  initialState,
  reducers: {
    changePropertyType: (state, action: PayloadAction<string>) => {
      if (state.filters.propertyType !== action.payload) {
        state.filters.propertyType = action.payload;
      }
    },
    changeDealType: (state, action: PayloadAction<string>) => {
      if (state.filters.dealType !== action.payload) {
        state.filters.dealType = action.payload;
      }
    },
    changeBedrooms: (state, action: PayloadAction<number | number[]>) => {
      if (JSON.stringify(state.filters.bedrooms) !== JSON.stringify(action.payload)) {
        state.filters.bedrooms = action.payload;
      }
    },
    changeBathrooms: (state, action: PayloadAction<number | number[]>) => {
      if (JSON.stringify(state.filters.bathrooms) !== JSON.stringify(action.payload)) {
        state.filters.bathrooms = action.payload;
      }
    },
    changeParkingSpaces: (state, action: PayloadAction<number | number[]>) => {
      if (JSON.stringify(state.filters.parkingSpaces) !== JSON.stringify(action.payload)) {
        state.filters.parkingSpaces = action.payload;
      }
    },
    changeMainPriceOnly: (state, action: PayloadAction<boolean>) => {
      if (state.filters.mainPriceOnly !== action.payload) {
        state.filters.mainPriceOnly = action.payload;
      }
    },
    changeIncludeSold: (state, action: PayloadAction<boolean>) => {
      if (state.filters.includeSold !== action.payload) {
        state.filters.includeSold = action.payload;
      }
    },
    changeAllowedWindowInDays: (state, action: PayloadAction<number>) => {
      if (state.filters.allowedWindowInDays !== action.payload) {
        state.filters.allowedWindowInDays = action.payload;
      }
    },
    changeConstructionStatus: (state, action: PayloadAction<string>) => {
      if (state.filters.constructionStatus !== action.payload) {
        state.filters.constructionStatus = action.payload;
      }
    },
    changeDistrictsToLoad: (state, action: PayloadAction<string[]>) => {
      state.districtsToLoad = action.payload;
    },
    toggleExpanded: (state) => {
      state.expanded = !state.expanded;
    },
    setExpanded: (state, action: PayloadAction<boolean>) => {
      state.expanded = action.payload;
    },
  },
});

export const {
  changePropertyType,
  changeDealType,
  changeBedrooms,
  changeBathrooms,
  changeAllowedWindowInDays,
  changeConstructionStatus,
  changeMainPriceOnly,
  changeIncludeSold,
  changeParkingSpaces,
  changeDistrictsToLoad,
  toggleExpanded,
  setExpanded,
} = FiltersSlice.actions;

export const selectFilters = (state: RootState) => state.filters.filters;
export const selectDistrictsToLoad = (state: RootState) => state.filters.districtsToLoad;
export const selectPropertyType = (state: RootState) => state.filters.filters.propertyType;
export const selectDealType = (state: RootState) => state.filters.filters.dealType;
export const selectBedrooms = (state: RootState) => state.filters.filters.bedrooms;
export const selectBathrooms = (state: RootState) => state.filters.filters.bathrooms;
export const selectParkingSpaces = (state: RootState) => state.filters.filters.parkingSpaces;
export const selectConstructionStatus = (state: RootState) => state.filters.filters.constructionStatus;
export const selectAllowedWindowInDays = (state: RootState) => state.filters.filters.allowedWindowInDays;
export const selectMainPriceOnly = (state: RootState) => state.filters.filters.mainPriceOnly;
export const selectIncludeSold = (state: RootState) => state.filters.filters.includeSold;
export const selectExpanded = (state: RootState) => state.filters.expanded;

export default FiltersSlice.reducer;
