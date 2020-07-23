import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LatLngLiteral } from 'leaflet';
import { RootState } from '../../app/store';

interface PopupState {
  position?: LatLngLiteral;
}

const initialState: PopupState = {
  position: undefined,
};

export const popupSlice = createSlice({
  name: 'Popup',
  initialState,
  reducers: {
    setPosition: (state, action: PayloadAction<LatLngLiteral | undefined>) => {
      state.position = action.payload;
    },
  },
});

export const { setPosition } = popupSlice.actions;

export const selectPopupPosition = (state: RootState) => state.popup.position;

export default popupSlice.reducer;
