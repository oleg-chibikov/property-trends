import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
interface CurrentLocationState {
  currentLocation?: [number, number];
  isPaused: boolean;
}

const initialState: CurrentLocationState = {
  currentLocation: undefined,
  isPaused: false,
};

export const currentLocationSlice = createSlice({
  name: 'CurrentLocation',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<[number, number]>) => {
      state.currentLocation = action.payload;
    },
    setIsCurrentLocationSearchPaused: (state, action: PayloadAction<boolean>) => {
      state.isPaused = action.payload;
    },
  },
});

export const { setCurrentLocation, setIsCurrentLocationSearchPaused } = currentLocationSlice.actions;

export const selectCurrentLocation = (state: RootState) => state.currentLocation.currentLocation;
export const selectIsCurrentLocationSearchPaused = (state: RootState) => state.currentLocation.isPaused;

export default currentLocationSlice.reducer;
