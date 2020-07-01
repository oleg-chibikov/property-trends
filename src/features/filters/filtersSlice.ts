import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { SuburbKey } from '../../interfaces';

const defaultRange: number[] = [0, 7];

export interface FiltersState {
  dealType: string;
  propertyType: string;
  bedrooms: number | number[];
  bathrooms: number | number[];
  parkingSpaces: number | number[];
  constructionStatus: string;
  allowedWindowInDays: number;
  mainPriceOnly: boolean;
  postCodes: SuburbKey[];
}

const initialState: FiltersState = {
  propertyType: 'apartment',
  dealType: 'buy',
  bedrooms: [2, 2],
  bathrooms: defaultRange,
  parkingSpaces: defaultRange,
  constructionStatus: 'any',
  allowedWindowInDays: 7,
  mainPriceOnly: false,
  postCodes: [],
};

export const FiltersSlice = createSlice({
  name: 'Filters',
  initialState,
  reducers: {
    changePropertyType: (state, action: PayloadAction<string>) => {
      state.propertyType = action.payload;
    },
    changeDealType: (state, action: PayloadAction<string>) => {
      state.dealType = action.payload;
    },
    changeBedrooms: (state, action: PayloadAction<number | number[]>) => {
      state.bedrooms = action.payload;
    },
    changeBathrooms: (state, action: PayloadAction<number | number[]>) => {
      state.bathrooms = action.payload;
    },
    changeParkingSpaces: (state, action: PayloadAction<number | number[]>) => {
      state.parkingSpaces = action.payload;
    },
    changeMainPriceOnly: (state, action: PayloadAction<boolean>) => {
      state.mainPriceOnly = action.payload;
    },
    changeAllowedWindowInDays: (state, action: PayloadAction<number>) => {
      state.allowedWindowInDays = action.payload;
    },
    changeConstructionStatus: (state, action: PayloadAction<string>) => {
      state.constructionStatus = action.payload;
    },
    changePostCodes: (state, action: PayloadAction<SuburbKey[]>) => {
      state.postCodes = action.payload;
    },
  },
});

export const { changePropertyType, changeDealType, changeBedrooms, changeBathrooms, changeAllowedWindowInDays, changeConstructionStatus, changeMainPriceOnly, changeParkingSpaces, changePostCodes } = FiltersSlice.actions;

export const selectFilters = (state: RootState) => state.filters;
export const selectPropertyType = (state: RootState) => state.filters.propertyType;
export const selectDealType = (state: RootState) => state.filters.dealType;
export const selectBedrooms = (state: RootState) => state.filters.bedrooms;
export const selectBathrooms = (state: RootState) => state.filters.bathrooms;
export const selectParkingSpaces = (state: RootState) => state.filters.parkingSpaces;
export const selectConstructionStatus = (state: RootState) => state.filters.constructionStatus;
export const selectAllowedWindowInDays = (state: RootState) => state.filters.allowedWindowInDays;
export const selectMainPriceOnly = (state: RootState) => state.filters.mainPriceOnly;

export default FiltersSlice.reducer;
