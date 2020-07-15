import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import currentLocationReducer from '../features/currentLocation/currentLocationSlice';
import reducer from '../features/districtList/districtListSlice';
import filtersReducer from '../features/filters/filtersSlice';
import infoReducer from '../features/info/infoSlice';
import legendReducer from '../features/legend/legendSlice';
import searchBoxReducer from '../features/search/searchBoxSlice';
import suburbListReducer from '../features/suburbList/suburbListSlice';

export const store = configureStore({
  reducer: {
    SuburbList: suburbListReducer,
    info: infoReducer,
    districtList: reducer,
    filters: filtersReducer,
    legend: legendReducer,
    searchBox: searchBoxReducer,
    currentLocation: currentLocationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
