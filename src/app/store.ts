import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import featureListReducer from '../features/featureList/featureListSlice';
import infoReducer from '../features/info/infoSlice';
import reducer from '../features/districtList/districtListSlice';
import filtersReducer from '../features/filters/filtersSlice';
import legendReducer from '../features/legend/legendSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    featureList: featureListReducer,
    info: infoReducer,
    districtList: reducer,
    filters: filtersReducer,
    legend: legendReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
