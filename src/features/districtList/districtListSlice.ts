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
  checkedDistricts: { [fileName: string]: number };
  checkedStates: { [state: string]: number };
  districtsByState: DistrictsByState;
  expanded: boolean;
  expandedState: string | false;
  retrySwitch: boolean;
  elementToScrollTo?: string;
  useAdaptiveColors: boolean;
}

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

const initialState: DistrictListState = {
  checkedDistricts: {},
  checkedStates: {},
  districtsByState: {},
  expanded: false,
  expandedState: false,
  retrySwitch: false,
  elementToScrollTo: undefined,
  useAdaptiveColors: true,
};

const clear = (state: DistrictListState) => {
  state.checkedDistricts = {};
  state.checkedStates = {};
};

const checkStateInternal = (state: DistrictListState, action: PayloadAction<string>) => {
  clear(state);
  const politicalState = action.payload;
  const defaultDistrictsForState = defaultDistrictsByState[politicalState];
  state.checkedStates[politicalState] = 0;
  state.expandedState = politicalState;
  for (const district of state.districtsByState[politicalState]) {
    if (defaultDistrictsForState) {
      for (const defaultDistrict of defaultDistrictsForState) {
        if (district.indexOf(defaultDistrict) > -1) {
          state.checkedDistricts[district] = 0;
          state.checkedStates[politicalState]++;
          break;
        }
      }
    } else {
      state.checkedDistricts[district] = 0;
      state.checkedStates[politicalState]++;
    }
  }
};

export const districtlistSlice = createSlice({
  name: 'DistrictList',
  initialState,
  reducers: {
    addDistrictFileNames: (state, action: PayloadAction<string[]>) => {
      const districts = action.payload;
      const districtsByState: DistrictsByState = {};
      for (const district of districts) {
        const politicalState = district.substr(0, district.indexOf(' - '));
        const districtsForState = districtsByState[politicalState] || [];
        districtsForState.push(district);
        districtsByState[politicalState] = districtsForState;
        stateByDistrict[district] = politicalState;
      }
      state.districtsByState = districtsByState;
    },
    checkState: checkStateInternal,
    uncheckState: (state, action: PayloadAction<string>) => {
      const politicalState = action.payload;
      delete state.checkedStates[politicalState];
      for (const district of state.districtsByState[politicalState]) {
        delete state.checkedDistricts[district];
      }
    },
    checkInitialStateIfEmpty: (state, action: PayloadAction<string>) => {
      if (!Object.keys(state.checkedStates).length) {
        checkStateInternal(state, action);
      }
    },
    checkDistrict: (state, action: PayloadAction<string>) => {
      const district = action.payload;
      if (district in state.checkedDistricts) {
        return;
      }
      const politicalState = stateByDistrict[district];
      state.checkedDistricts[district] = 0;
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
      state.checkedDistricts[district] = 0;
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
    toggleExpanded: (state) => {
      state.expanded = !state.expanded;
    },
    setExpanded: (state, action: PayloadAction<boolean>) => {
      state.expanded = action.payload;
    },
    setExpandedState: (state, action: PayloadAction<string | false>) => {
      state.expandedState = action.payload;
    },
    toggleRetry: (state) => {
      state.retrySwitch = !state.retrySwitch;
    },
    setElementToScrollTo: (state, action: PayloadAction<string | undefined>) => {
      state.elementToScrollTo = action.payload;
    },
    toggleUseAdaptiveColors: (state) => {
      state.useAdaptiveColors = !state.useAdaptiveColors;
    },
  },
});

export const {
  checkDistrict,
  checkDistrictOnly,
  uncheckDistrict,
  checkState,
  uncheckState,
  checkInitialStateIfEmpty,
  toggleExpanded,
  setExpanded,
  setExpandedState,
  addDistrictFileNames,
  toggleRetry,
  setElementToScrollTo,
  toggleUseAdaptiveColors,
} = districtlistSlice.actions;

export const selectCheckedDistricts = (state: RootState) => state.districtList.checkedDistricts;
export const selectDistrictsByState = (state: RootState) => state.districtList.districtsByState;
export const selectCheckedStates = (state: RootState) => state.districtList.checkedStates;
export const selectExpanded = (state: RootState) => state.districtList.expanded;
export const selectExpandedState = (state: RootState) => state.districtList.expandedState;
export const selectRetrySwitch = (state: RootState) => state.districtList.retrySwitch;
export const selectElementToScrollTo = (state: RootState) => state.districtList.elementToScrollTo;
export const selectUseAdaptiveColors = (state: RootState) => state.districtList.useAdaptiveColors;

export default districtlistSlice.reducer;
