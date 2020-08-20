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
    highlightSearchBoxSuburb: (state, action: PayloadAction<string>) => {
      state.highlightedSuburb = action.payload;
    },
    unhighlightSearchBoxSuburb: (state) => {
      state.highlightedSuburb = undefined;
    },
    setSearchResult: (state, action: PayloadAction<string>) => {
      state.selectedSuburb = action.payload;
    },
    removeSearchResult: (state) => {
      state.selectedSuburb = undefined;
    },
    toggleSearchBoxExpanded: (state) => {
      state.expanded = !state.expanded;
    },
    setSearchBoxExpanded: (state, action: PayloadAction<boolean>) => {
      state.expanded = action.payload;
    },
  },
});

export const { highlightSearchBoxSuburb, unhighlightSearchBoxSuburb, setSearchResult, removeSearchResult, toggleSearchBoxExpanded, setSearchBoxExpanded } = searchBoxSlice.actions;

export const selectSearchBoxSelectedSuburb = (state: RootState) => state.searchBox.selectedSuburb;
export const selectSearchBoxHighlightedSuburb = (state: RootState) => state.searchBox.highlightedSuburb;
export const selectSearchBoxExpanded = (state: RootState) => state.searchBox.expanded;

export default searchBoxSlice.reducer;
