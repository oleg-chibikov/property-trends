import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { SuburbInfo } from '../../interfaces';

interface HighlightSuburbParams {
  suburbId: string;
  scroll: boolean;
}

interface SuburbListState {
  suburbs: { [suburbId: string]: SuburbInfo };
  scrollToSuburb: string | undefined;
}

const initialState: SuburbListState = {
  suburbs: {},
  scrollToSuburb: undefined,
};

export const suburbListSlice = createSlice({
  name: 'SuburbList',
  initialState,
  reducers: {
    addSuburb: (state, action: PayloadAction<SuburbInfo>) => {
      state.suburbs[action.payload.suburbId] = action.payload;
    },
    removeSuburb: (state, action: PayloadAction<string>) => {
      delete state.suburbs[action.payload];
    },
    highlightSuburb: (state, action: PayloadAction<string>) => {
      const suburbId = action.payload;
      const suburb = state.suburbs[suburbId];
      if (!suburb) {
        return;
      }
      suburb.isHighlighted = true;
    },
    unhighlightSuburb: (state, action: PayloadAction<string>) => {
      const suburbId = action.payload;
      const suburb = state.suburbs[suburbId];
      if (!suburb) {
        return;
      }
      suburb.isHighlighted = false;
      state.scrollToSuburb = undefined;
    },
    setSuburbColor: (state, action: PayloadAction<{ suburbId: string; color: string }>) => {
      const suburb = state.suburbs[action.payload.suburbId];
      if (!suburb) {
        return;
      }
      suburb.color = action.payload.color;
    },
    scrollToSuburb: (state, action: PayloadAction<string>) => {
      state.scrollToSuburb = action.payload;
    },
  },
});

export const { addSuburb, removeSuburb, highlightSuburb, unhighlightSuburb, setSuburbColor, scrollToSuburb } = suburbListSlice.actions;

export const selectSuburbs = (state: RootState) => state.SuburbList.suburbs;
export const selectScrollToSuburb = (state: RootState) => state.SuburbList.scrollToSuburb;

export default suburbListSlice.reducer;
