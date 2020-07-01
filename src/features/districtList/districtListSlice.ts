import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface DistrictsByState {
  [state: string]: string[];
}

interface DistrictListState {
  checkedDistricts: { [fileName: string]: undefined };
  districtsByState: DistrictsByState;
}

const initialDistrictsByState: { [state: string]: string[] } = {};
const defaultDistrictsByState: { [state: string]: string[] } = {
  NSW: [
    'Sydney - City',
    'Sydney - Eastern',
    'Sydney - Inner',
    //'Sydney - North',
    //'Sydney - Ryde',
    // 'Sydney - Parramatta',
    // 'Sydney - Sutherland'
  ],
  QLD: ['Brisbane'],
  TAS: ['Hobart'],
  SA: ['Adelaide'],
  WA: ['Perth'],
  NT: ['Darwin'],
  VIC: ['Melbourne'],
};
const districtString = process.env.GEO_FILES || '';
const districts = districtString.split('|');
for (const district of districts) {
  const state = district.substr(0, district.indexOf(' - '));
  const districtsForState = initialDistrictsByState[state] || [];
  districtsForState.push(district);
  initialDistrictsByState[state] = districtsForState;
}

const selectState = (state: DistrictListState, stateName: string) => {
  const defaultDistrictsForState = defaultDistrictsByState[stateName];
  for (const district of state.districtsByState[stateName]) {
    if (defaultDistrictsForState) {
      for (const defaultDistrict of defaultDistrictsForState) {
        if (district.indexOf(defaultDistrict) > -1) {
          state.checkedDistricts[district] = undefined;
          break;
        }
      }
    } else {
      state.checkedDistricts[district] = undefined;
    }
  }
};

const initialState: DistrictListState = {
  checkedDistricts: { 'NSW - Sydney - Eastern Suburbs.simplified.json': undefined },
  districtsByState: initialDistrictsByState,
};

selectState(initialState, 'NSW');

export const districtlistSlice = createSlice({
  name: 'DistrictList',
  initialState,
  reducers: {
    checkState: (state, action: PayloadAction<string>) => {
      state.checkedDistricts = {};
      selectState(state, action.payload);
    },
    uncheckState: (state, action: PayloadAction<string>) => {
      for (const district of state.districtsByState[action.payload]) {
        delete state.checkedDistricts[district];
      }
    },
    checkDistrict: (state, action: PayloadAction<string>) => {
      state.checkedDistricts[action.payload] = undefined;
    },
    uncheckDistrict: (state, action: PayloadAction<string>) => {
      delete state.checkedDistricts[action.payload];
    },
  },
});

export const { checkDistrict, uncheckDistrict, checkState, uncheckState } = districtlistSlice.actions;

export const selectDistrictList = (state: RootState) => state.districtList;

export default districtlistSlice.reducer;
