import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import suburbsListControlReducer from '../features/realEstateMap/suburbsListControlSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    suburbsListControl: suburbsListControlReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
