import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import FeatureListReducer from '../features/featureList/featureListSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    FeatureList: FeatureListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
