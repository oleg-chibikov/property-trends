import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { StateAndDistrict } from '../../interfaces';
import DomainUtils from '../../utils/domainUtils';

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
    // 'Sydney - North',
    // 'Sydney - Ryde',
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
  checkedDistrictFileNames: { [fileName: string]: number };
  checkedStates: { [state: string]: number };
  districtFileNamesByState: DistrictsByState;
  expanded: boolean;
  expandedState: string | false;
  retrySwitch: boolean;
  elementToScrollTo?: string;
  useAdaptiveColors: boolean;
  zoomToSelection: boolean;
}

const initialState: DistrictListState = {
  checkedDistrictFileNames: {},
  checkedStates: {},
  districtFileNamesByState: {},
  expanded: false,
  expandedState: false,
  retrySwitch: false,
  elementToScrollTo: undefined,
  useAdaptiveColors: false,
  zoomToSelection: true,
};

const clear = (state: DistrictListState) => {
  state.checkedDistrictFileNames = {};
  state.checkedStates = {};
};

const checkStateInternal = (state: DistrictListState, zoomToSelection: boolean, politicalState: string, districts?: string[]) => {
  state.zoomToSelection = zoomToSelection;
  state.checkedStates[politicalState] = 0;
  state.expandedState = politicalState;
  const districtsToCheck = districts || defaultDistrictsByState[politicalState];
  for (const district of state.districtFileNamesByState[politicalState]) {
    if (districtsToCheck) {
      // Select only requested districts
      for (const defaultDistrict of districtsToCheck) {
        if (district.indexOf(defaultDistrict) > -1) {
          state.checkedDistrictFileNames[district] = 0;
          state.checkedStates[politicalState]++;
          break;
        }
      }
    } else {
      // Select whole state
      state.checkedDistrictFileNames[district] = 0;
      state.checkedStates[politicalState]++;
    }
  }
};

export const districtListSlice = createSlice({
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
      state.districtFileNamesByState = districtsByState;
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
      for (const fileName of state.districtFileNamesByState[politicalState]) {
        delete state.checkedDistrictFileNames[fileName];
      }
    },
    checkInitialStateIfEmpty: (state, action: PayloadAction<string>) => {
      if (!Object.keys(state.checkedStates).length) {
        clear(state);
        checkStateInternal(state, true, action.payload);
      }
    },
    checkDistrict: (state, action: PayloadAction<string>) => {
      const fileName = action.payload;
      if (fileName in state.checkedDistrictFileNames) {
        return;
      }
      state.zoomToSelection = true;
      const politicalState = stateByDistrict[fileName];
      state.checkedDistrictFileNames[fileName] = 0;
      if (!state.checkedStates[politicalState]) {
        state.checkedStates[politicalState] = 0;
      }
      state.checkedStates[politicalState]++;
    },
    checkStatesAndDistricts: (state, action: PayloadAction<StateAndDistrict[]>) => {
      const statesAndDistricts = action.payload;
      const allNewDistricts = statesAndDistricts.map((x) => x.district).sort();
      const allExistingDistricts = state.checkedDistrictFileNames ? Object.keys(state.checkedDistrictFileNames).map(DomainUtils.getDistrictNameFromFileName).sort() : [];

      if (JSON.stringify(allNewDistricts) === JSON.stringify(allExistingDistricts)) {
        console.log('Selected districts are identical to previous selection');
        return;
      }
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
      state.checkedDistrictFileNames[district] = 0;
      state.checkedStates[politicalState]++;
    },
    uncheckDistrict: (state, action: PayloadAction<string>) => {
      state.zoomToSelection = true;
      const district = action.payload;
      const politicalState = stateByDistrict[district];
      delete state.checkedDistrictFileNames[district];
      state.checkedStates[politicalState]--;
      if (state.checkedStates[politicalState] <= 0) {
        delete state.checkedStates[politicalState];
      }
    },
    toggleDistrictListExpanded: (state) => {
      state.expanded = !state.expanded;
    },
    setDistrictListExpanded: (state, action: PayloadAction<boolean>) => {
      state.expanded = action.payload;
    },
    setDistrictListExpandedState: (state, action: PayloadAction<string | false>) => {
      state.expandedState = action.payload;
    },
    toggleDistrictListRetry: (state) => {
      state.retrySwitch = !state.retrySwitch;
    },
    setDistrictListElementToScrollTo: (state, action: PayloadAction<string | undefined>) => {
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
  toggleDistrictListExpanded,
  setDistrictListExpanded,
  setDistrictListExpandedState,
  addDistrictFileNames,
  toggleDistrictListRetry,
  setDistrictListElementToScrollTo,
  toggleUseAdaptiveColors,
  checkStatesAndDistricts,
  setZoomToSelection,
} = districtListSlice.actions;

export const selectCheckedDistricts = (state: RootState) => state.districtList.checkedDistrictFileNames;
export const selectDistrictsByState = (state: RootState) => state.districtList.districtFileNamesByState;
export const selectCheckedStates = (state: RootState) => state.districtList.checkedStates;
export const selectDistrictListExpanded = (state: RootState) => state.districtList.expanded;
export const selectDistrictListExpandedState = (state: RootState) => state.districtList.expandedState;
export const selectDistrictListRetrySwitch = (state: RootState) => state.districtList.retrySwitch;
export const selectElementToScrollTo = (state: RootState) => state.districtList.elementToScrollTo;
export const selectUseAdaptiveColors = (state: RootState) => state.districtList.useAdaptiveColors;
export const selectZoomToSelection = (state: RootState) => state.districtList.zoomToSelection;

export default districtListSlice.reducer;
