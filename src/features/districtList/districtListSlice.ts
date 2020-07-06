import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface DistrictsByState {
  [state: string]: string[];
}

interface StateByDistrict {
  [state: string]: string;
}

const stateByDistrict: StateByDistrict = {};

interface DistrictListState {
  checkedDistricts: { [fileName: string]: undefined };
  checkedStates: { [state: string]: number };
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
  const politicalState = district.substr(0, district.indexOf(' - '));
  const districtsForState = initialDistrictsByState[politicalState] || [];
  districtsForState.push(district);
  initialDistrictsByState[politicalState] = districtsForState;
  stateByDistrict[district] = politicalState;
}

const selectState = (state: DistrictListState, politicalState: string) => {
  const defaultDistrictsForState = defaultDistrictsByState[politicalState];
  state.checkedStates[politicalState] = 0;
  for (const district of state.districtsByState[politicalState]) {
    if (defaultDistrictsForState) {
      for (const defaultDistrict of defaultDistrictsForState) {
        if (district.indexOf(defaultDistrict) > -1) {
          state.checkedDistricts[district] = undefined;
          state.checkedStates[politicalState]++;
          break;
        }
      }
    } else {
      state.checkedDistricts[district] = undefined;
      state.checkedStates[politicalState]++;
    }
  }
};

const initialState: DistrictListState = {
  checkedDistricts: {},
  checkedStates: {},
  districtsByState: initialDistrictsByState,
};

selectState(initialState, 'NSW');

const clear = (state: DistrictListState) => {
  state.checkedDistricts = {};
  state.checkedStates = {};
};

export const districtlistSlice = createSlice({
  name: 'DistrictList',
  initialState,
  reducers: {
    checkState: (state, action: PayloadAction<string>) => {
      clear(state);
      selectState(state, action.payload);
    },
    uncheckState: (state, action: PayloadAction<string>) => {
      const politicalState = action.payload;
      delete state.checkedStates[politicalState];
      for (const district of state.districtsByState[politicalState]) {
        delete state.checkedDistricts[district];
      }
    },
    checkDistrict: (state, action: PayloadAction<string>) => {
      const district = action.payload;
      if (district in state.checkedDistricts) {
        return;
      }
      const politicalState = stateByDistrict[district];
      state.checkedDistricts[district] = undefined;
      if (!state.checkedStates[politicalState]) {
        state.checkedStates[politicalState] = 0;
      }
      state.checkedStates[politicalState]++;
    },
    checkDistrictOnly: (state, action: PayloadAction<string>) => {
      clear(state);
      const district = action.payload;
      const politicalState = stateByDistrict[district];
      state.checkedStates[politicalState] = 0;
      state.checkedDistricts[district] = undefined;
      state.checkedStates[politicalState]++;
    },
    uncheckDistrict: (state, action: PayloadAction<string>) => {
      const district = action.payload;
      const politicalState = stateByDistrict[district];
      delete state.checkedDistricts[district];
      state.checkedStates[politicalState]--;
      if (state.checkedStates[politicalState] <= 0) {
        delete state.checkedStates[politicalState];
      }
    },
  },
});

export const { checkDistrict, checkDistrictOnly, uncheckDistrict, checkState, uncheckState } = districtlistSlice.actions;

export const selectCheckedDistricts = (state: RootState) => state.districtList.checkedDistricts;
export const selectDistrictsByState = (state: RootState) => state.districtList.districtsByState;
export const selectCheckedStates = (state: RootState) => state.districtList.checkedStates;

export default districtlistSlice.reducer;
