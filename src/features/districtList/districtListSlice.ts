import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface DistrictListState {
  checkedDistricts: { [fileName: string]: undefined };
}

const initialState: DistrictListState = {
  checkedDistricts: {},
};

export const districtlistSlice = createSlice({
  name: 'DistrictList',
  initialState,
  reducers: {
    checkDistrict: (state, action: PayloadAction<string>) => {
      state.checkedDistricts[action.payload] = undefined;
    },
    uncheckDistrict: (state, action: PayloadAction<string>) => {
      delete state.checkedDistricts[action.payload];
    },
  },
});

export const { checkDistrict, uncheckDistrict } = districtlistSlice.actions;

export const selectDistrictList = (state: RootState) => state.districtList;

export default districtlistSlice.reducer;
