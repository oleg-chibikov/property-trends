import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const defaultRange: number[] = [0, 7];

interface FiltersState {
  filters: MapFilters;
  expanded: boolean;
}

export interface MapFilters {
  dealType: string;
  propertyType: string;
  bedrooms: number | number[];
  bathrooms: number | number[];
  parkingSpaces: number | number[];
  constructionStatus: string;
  allowedWindowInDays: number;
  mainPriceOnly: boolean;
  districts: string[];
}

const initialState: FiltersState = {
  filters: { propertyType: 'apartment', dealType: 'buy', bedrooms: [2, 2], bathrooms: defaultRange, parkingSpaces: defaultRange, constructionStatus: 'any', allowedWindowInDays: 7, mainPriceOnly: true, districts: [] },
  expanded: false,
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
    changeDistricts: (state, action: PayloadAction<string[]>) => {
      state.filters.districts = action.payload;
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
  changeParkingSpaces,
  changeDistricts,
  toggleExpanded,
  setExpanded,
} = FiltersSlice.actions;

export const selectFilters = (state: RootState) => state.filters.filters;
export const selectPropertyType = (state: RootState) => state.filters.filters.propertyType;
export const selectDealType = (state: RootState) => state.filters.filters.dealType;
export const selectBedrooms = (state: RootState) => state.filters.filters.bedrooms;
export const selectBathrooms = (state: RootState) => state.filters.filters.bathrooms;
export const selectParkingSpaces = (state: RootState) => state.filters.filters.parkingSpaces;
export const selectConstructionStatus = (state: RootState) => state.filters.filters.constructionStatus;
export const selectAllowedWindowInDays = (state: RootState) => state.filters.filters.allowedWindowInDays;
export const selectMainPriceOnly = (state: RootState) => state.filters.filters.mainPriceOnly;
export const selectExpanded = (state: RootState) => state.filters.expanded;

export default FiltersSlice.reducer;
