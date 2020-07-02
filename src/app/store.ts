import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import reducer from '../features/districtList/districtListSlice';
import filtersReducer from '../features/filters/filtersSlice';
import infoReducer from '../features/info/infoSlice';
import legendReducer from '../features/legend/legendSlice';
import featureListReducer from '../features/suburbList/suburbListSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    SuburbList: featureListReducer,
    info: infoReducer,
    districtList: reducer,
    filters: filtersReducer,
    legend: legendReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
