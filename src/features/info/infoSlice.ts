import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { FeatureProperties } from './../../interfaces';

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

export const selectInfo = (state: RootState) => state.info.currentInfo;

export default infoSlice.reducer;
