import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { HistoryEntry, RealEstateEntry, SuburbKeyWithState } from '../../interfaces';

interface SuburbInfoState {
  expanded: boolean;
  suburbKey?: SuburbKeyWithState;
  properties?: RealEstateEntry[];
  history?: HistoryEntry[];
  activeTab: string;
}

const initialState: SuburbInfoState = {
  expanded: false,
  suburbKey: undefined,
  properties: undefined,
  history: undefined,
  activeTab: 'History',
};

export const suburbinfoSlice = createSlice({
  name: 'SuburbInfo',
  initialState,
  reducers: {
    toggleExpanded: (state) => {
      state.expanded = !state.expanded;
    },
    setExpanded: (state, action: PayloadAction<boolean>) => {
      state.expanded = action.payload;
    },
    setSuburbKey: (state, action: PayloadAction<SuburbKeyWithState | undefined>) => {
      state.suburbKey = action.payload;
    },
    setProperties: (state, action: PayloadAction<RealEstateEntry[] | undefined>) => {
      state.properties = action.payload;
    },
    setHistory: (state, action: PayloadAction<HistoryEntry[] | undefined>) => {
      state.history = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setSuburbKey, setProperties, setHistory, toggleExpanded, setExpanded, setActiveTab } = suburbinfoSlice.actions;

export const selectSuburbInfoPosition = (state: RootState) => state.suburbInfo.expanded;
export const selectSuburbKey = (state: RootState) => state.suburbInfo.suburbKey;
export const selectProperties = (state: RootState) => state.suburbInfo.properties;
export const selectHistory = (state: RootState) => state.suburbInfo.history;
export const selectExpanded = (state: RootState) => state.suburbInfo.expanded;
export const selectActiveTab = (state: RootState) => state.suburbInfo.activeTab;

export default suburbinfoSlice.reducer;
