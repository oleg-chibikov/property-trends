import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
interface InfoState {
  currentLocation?: [number, number];
}

const initialState: InfoState = {
  currentLocation: undefined,
};

export const currentLocationSlice = createSlice({
  name: 'CurrentLocation',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<[number, number]>) => {
      state.currentLocation = action.payload;
    },
  },
});

export const { setCurrentLocation } = currentLocationSlice.actions;

export const selectCurrentLocation = (state: RootState) => state.currentLocation.currentLocation;

export default currentLocationSlice.reducer;
