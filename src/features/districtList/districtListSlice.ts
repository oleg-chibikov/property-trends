import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { StateAndDistrict } from '../../interfaces';

export interface DistrictsByState {
  [state: string]: string[];
}

interface StateByDistrict {
  [state: string]: string;
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
  zoomToSelection: boolean;
}

const initialState: DistrictListState = {
  checkedDistricts: {},
  checkedStates: {},
  districtsByState: {},
  expanded: false,
  expandedState: false,
  retrySwitch: false,
  elementToScrollTo: undefined,
  useAdaptiveColors: true,
  zoomToSelection: true,
};

const clear = (state: DistrictListState) => {
  state.checkedDistricts = {};
  state.checkedStates = {};
};

const checkStateInternal = (state: DistrictListState, zoomToSelection: boolean, politicalState: string, districts?: string[]) => {
  state.zoomToSelection = zoomToSelection;
  state.checkedStates[politicalState] = 0;
  state.expandedState = politicalState;
  const districtsToCheck = districts || defaultDistrictsByState[politicalState];
  for (const district of state.districtsByState[politicalState]) {
    if (districtsToCheck) {
      // Select only requested districts
      for (const defaultDistrict of districtsToCheck) {
        if (district.indexOf(defaultDistrict) > -1) {
          state.checkedDistricts[district] = 0;
          state.checkedStates[politicalState]++;
          break;
        }
      }
    } else {
      // Select whole state
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
    checkState: (state, action: PayloadAction<string>) => {
      clear(state);
      checkStateInternal(state, true, action.payload);
    },
    setZoomToSelection: (state, action: PayloadAction<boolean>) => {
      state.zoomToSelection = action.payload;
    },
    uncheckState: (state, action: PayloadAction<string>) => {
      state.zoomToSelection = true;
      const politicalState = action.payload;
      delete state.checkedStates[politicalState];
      for (const district of state.districtsByState[politicalState]) {
        delete state.checkedDistricts[district];
      }
    },
    checkInitialStateIfEmpty: (state, action: PayloadAction<string>) => {
      if (!Object.keys(state.checkedStates).length) {
        clear(state);
        checkStateInternal(state, true, action.payload);
      }
    },
    checkDistrict: (state, action: PayloadAction<string>) => {
      const district = action.payload;
      if (district in state.checkedDistricts) {
        return;
      }
      state.zoomToSelection = true;
      const politicalState = stateByDistrict[district];
      state.checkedDistricts[district] = 0;
      if (!state.checkedStates[politicalState]) {
        state.checkedStates[politicalState] = 0;
      }
      state.checkedStates[politicalState]++;
    },
    checkStatesAndDistricts: (state, action: PayloadAction<StateAndDistrict[]>) => {
      const statesAndDistricts = action.payload;
      clear(state);
      const districtsByState: DistrictsByState = {};
      for (const stateAndDistrict of statesAndDistricts) {
        const politicalState = stateAndDistrict.state;
        const district = stateAndDistrict.district;
        if (!districtsByState[politicalState]) {
          districtsByState[politicalState] = [district];
        } else {
          districtsByState[politicalState].push(district);
        }
      }
      for (const politicalState of Object.keys(districtsByState)) {
        const districts = districtsByState[politicalState];
        checkStateInternal(state, false, politicalState, districts);
      }
    },
    checkDistrictOnly: (state, action: PayloadAction<string>) => {
      clear(state);
      state.zoomToSelection = true;
      const district = action.payload;
      const politicalState = stateByDistrict[district];
      state.checkedStates[politicalState] = 0;
      state.checkedDistricts[district] = 0;
      state.checkedStates[politicalState]++;
    },
    uncheckDistrict: (state, action: PayloadAction<string>) => {
      state.zoomToSelection = true;
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
  checkStatesAndDistricts,
  setZoomToSelection,
} = districtlistSlice.actions;

export const selectCheckedDistricts = (state: RootState) => state.districtList.checkedDistricts;
export const selectDistrictsByState = (state: RootState) => state.districtList.districtsByState;
export const selectCheckedStates = (state: RootState) => state.districtList.checkedStates;
export const selectExpanded = (state: RootState) => state.districtList.expanded;
export const selectExpandedState = (state: RootState) => state.districtList.expandedState;
export const selectRetrySwitch = (state: RootState) => state.districtList.retrySwitch;
export const selectElementToScrollTo = (state: RootState) => state.districtList.elementToScrollTo;
export const selectUseAdaptiveColors = (state: RootState) => state.districtList.useAdaptiveColors;
export const selectZoomToSelection = (state: RootState) => state.districtList.zoomToSelection;

export default districtlistSlice.reducer;
