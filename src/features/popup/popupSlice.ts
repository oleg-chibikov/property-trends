import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LatLngLiteral } from 'leaflet';
import { RootState } from '../../app/store';
import { RealEstateEntry, SuburbKey } from './../../interfaces';

interface PopupState {
  position?: LatLngLiteral;
  suburbKey?: SuburbKey;
  properties?: RealEstateEntry[];
}

const initialState: PopupState = {
  position: undefined,
  suburbKey: undefined,
  properties: undefined,
};

export const popupSlice = createSlice({
  name: 'Popup',
  initialState,
  reducers: {
    setPosition: (state, action: PayloadAction<LatLngLiteral | undefined>) => {
      state.position = action.payload;
    },
    setSuburbKey: (state, action: PayloadAction<SuburbKey | undefined>) => {
      state.suburbKey = action.payload;
    },
    setProperties: (state, action: PayloadAction<RealEstateEntry[] | undefined>) => {
      state.properties = action.payload;
    },
  },
});

export const { setPosition, setSuburbKey, setProperties } = popupSlice.actions;

export const selectPopupPosition = (state: RootState) => state.popup.position;
export const selectSuburbKey = (state: RootState) => state.popup.suburbKey;
export const selectProperties = (state: RootState) => state.popup.properties;

export default popupSlice.reducer;
