import { FeatureProperties } from './../../interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface InfoState {
  currentInfo?: FeatureProperties;
}

const initialState: InfoState = {
  currentInfo: undefined,
};

export const infoSlice = createSlice({
  name: 'Info',
  initialState,
  reducers: {
    setInfo: (state, action: PayloadAction<FeatureProperties>) => {
      state.currentInfo = action.payload;
    },
    clearInfo: (state) => {
      state.currentInfo = undefined;
    },
  },
});

export const { setInfo, clearInfo } = infoSlice.actions;

export const selectInfo = (state: RootState) => state.info;

export default infoSlice.reducer;
