import { Action, combineReducers, configureStore, getDefaultMiddleware, ThunkAction } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import currentLocationReducer from '../features/currentLocation/currentLocationSlice';
import districtListReducer from '../features/districtList/districtListSlice';
import filtersReducer from '../features/filters/filtersSlice';
import infoReducer from '../features/info/infoSlice';
import legendReducer from '../features/legend/legendSlice';
import searchBoxReducer from '../features/search/searchBoxSlice';
import suburbInfoReducer from '../features/suburbInfo/suburbInfoSlice';
import suburbListReducer from '../features/suburbList/suburbListSlice';
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['info', 'legend', 'searchBox', 'currentLocation', 'suburbList'],
};

const rootReducer = combineReducers({
  suburbList: suburbListReducer,
  info: infoReducer,
  districtList: districtListReducer,
  filters: filtersReducer,
  legend: legendReducer,
  searchBox: searchBoxReducer,
  currentLocation: currentLocationReducer,
  suburbInfo: suburbInfoReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
