import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { SuburbInfo } from '../../interfaces';

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
    replaceSuburbsInList: (state, action: PayloadAction<{ [suburbId: string]: SuburbInfo }>) => {
      state.suburbs = action.payload;
    },
    highlightSuburbInList: (state, action: PayloadAction<string>) => {
      const suburbId = action.payload;
      const suburb = state.suburbs[suburbId];
      if (!suburb) {
        return;
      }
      suburb.isHighlighted = true;
    },
    unhighlightSuburbInList: (state, action: PayloadAction<string>) => {
      const suburbId = action.payload;
      const suburb = state.suburbs[suburbId];
      if (!suburb) {
        return;
      }
      suburb.isHighlighted = false;
      state.scrollToSuburb = undefined;
    },
    setSuburbColorInList: (state, action: PayloadAction<{ suburbId: string; color: string }>) => {
      const suburb = state.suburbs[action.payload.suburbId];
      if (!suburb) {
        return;
      }
      suburb.color = action.payload.color;
    },
    scrollToSuburbInList: (state, action: PayloadAction<string>) => {
      state.scrollToSuburb = action.payload;
    },
  },
});

export const { replaceSuburbsInList, highlightSuburbInList, unhighlightSuburbInList, setSuburbColorInList, scrollToSuburbInList } = suburbListSlice.actions;

export const selectSuburbsInList = (state: RootState) => state.suburbList.suburbs;
export const selectScrollToSuburbInList = (state: RootState) => state.suburbList.scrollToSuburb;

export default suburbListSlice.reducer;
