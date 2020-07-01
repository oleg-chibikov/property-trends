import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import featureListReducer from '../features/featureList/featureListSlice';
import filtersReducer from '../features/filters/filtersSlice';
import infoReducer from '../features/info/infoSlice';
import legendReducer from '../features/legend/legendSlice';
import reducer from '../features/districtList/districtListSlice';

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
