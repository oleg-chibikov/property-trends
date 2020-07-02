import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface SearchBoxState {
  highlightedSuburb: string | undefined;
  selectedSuburb: string | undefined;
}

const initialState: SearchBoxState = {
  highlightedSuburb: undefined,
  selectedSuburb: undefined,
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
    selectSuburb: (state, action: PayloadAction<string>) => {
      state.selectedSuburb = action.payload;
    },
    deselectSuburb: (state) => {
      state.selectedSuburb = undefined;
    },
  },
});

export const { highlightSuburb, unhighlightSuburb, selectSuburb, deselectSuburb } = searchBoxSlice.actions;

export const selectSelectedSuburb = (state: RootState) => state.searchBox.selectedSuburb;
export const selectHighlightedSuburb = (state: RootState) => state.searchBox.highlightedSuburb;

export default searchBoxSlice.reducer;
