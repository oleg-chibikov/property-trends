import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { HistoryEntry, RealEstateEntry, SuburbKeyWithState } from '../../interfaces';

interface SuburbInfoState {
  expanded: boolean;
  suburbKey?: SuburbKeyWithState;
  properties?: RealEstateEntry[];
  history?: HistoryEntry[];
  activeTab: string;
  chartBrushSelection: number[];
}

const currentDate = new Date();
const oneYearFromNow = new Date();
oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() - 1);

const initialState: SuburbInfoState = {
  expanded: false,
  suburbKey: undefined,
  properties: undefined,
  history: undefined,
  activeTab: 'History',
  chartBrushSelection: [currentDate.getTime(), oneYearFromNow.getTime()],
};

export const suburbInfoSlice = createSlice({
  name: 'SuburbInfo',
  initialState,
  reducers: {
    toggleSuburbInfoExpanded: (state) => {
      state.expanded = !state.expanded;
    },
    setSuburbInfoExpanded: (state, action: PayloadAction<boolean>) => {
      state.expanded = action.payload;
    },
    setSuburbInfoSuburbKey: (state, action: PayloadAction<SuburbKeyWithState | undefined>) => {
      state.suburbKey = action.payload;
    },
    setSuburbInfoProperties: (state, action: PayloadAction<RealEstateEntry[] | undefined>) => {
      state.properties = action.payload;
    },
    setSuburbInfoHistory: (state, action: PayloadAction<HistoryEntry[] | undefined>) => {
      state.history = action.payload;
    },
    setSuburbInfoActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setSuburbInfoChartBrushSelection: (state, action: PayloadAction<number[]>) => {
      state.chartBrushSelection = action.payload;
    },
  },
});

export const { setSuburbInfoSuburbKey, setSuburbInfoProperties, setSuburbInfoHistory, toggleSuburbInfoExpanded, setSuburbInfoExpanded, setSuburbInfoActiveTab, setSuburbInfoChartBrushSelection } = suburbInfoSlice.actions;

export const selectSuburbInfoPosition = (state: RootState) => state.suburbInfo.expanded;
export const selectSuburbInfoSuburbKey = (state: RootState) => state.suburbInfo.suburbKey;
export const selectSuburbInfoProperties = (state: RootState) => state.suburbInfo.properties;
export const selectSuburbInfoHistory = (state: RootState) => state.suburbInfo.history;
export const selectSuburbInfoExpanded = (state: RootState) => state.suburbInfo.expanded;
export const selectSuburbInfoActiveTab = (state: RootState) => state.suburbInfo.activeTab;
export const selectSuburbInfoChartBrushSelection = (state: RootState) => state.suburbInfo.chartBrushSelection;

export default suburbInfoSlice.reducer;
