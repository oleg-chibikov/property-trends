import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface SearchBoxState {
  highlightedSuburb: string | undefined;
  selectedSuburb: string | undefined;
  expanded: boolean;
}

const initialState: SearchBoxState = {
  highlightedSuburb: undefined,
  selectedSuburb: undefined,
  expanded: false,
};

export const searchBoxSlice = createSlice({
  name: 'SearchBox',
  initialState,
  reducers: {
    highlightSuburb: (state, action: PayloadAction<string>) => {
      state.highlightedSuburb = action.payload;
    },
    unhighlightSuburb: (state) => {
      state.highlightedSuburb = undefined;
    },
    setSearchResult: (state, action: PayloadAction<string>) => {
      state.selectedSuburb = action.payload;
    },
    removeSearchResult: (state) => {
      state.selectedSuburb = undefined;
    },
    toggleExpanded: (state) => {
      state.expanded = !state.expanded;
    },
    setExpanded: (state, action: PayloadAction<boolean>) => {
      state.expanded = action.payload;
    },
  },
});

export const { highlightSuburb, unhighlightSuburb, setSearchResult, removeSearchResult, toggleExpanded, setExpanded } = searchBoxSlice.actions;

export const selectSelectedSuburb = (state: RootState) => state.searchBox.selectedSuburb;
export const selectHighlightedSuburb = (state: RootState) => state.searchBox.highlightedSuburb;
export const selectExpanded = (state: RootState) => state.searchBox.expanded;

export default searchBoxSlice.reducer;
