import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import suburbsListReducer from '../features/suburbsList/suburbsListSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    suburbsList: suburbsListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
