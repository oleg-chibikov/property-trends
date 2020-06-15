import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface SuburbsListState {
  suburbs: string[];
}

const initialState: SuburbsListState = {
  suburbs: [],
};

export const SuburbsListSlice = createSlice({
  name: 'SuburbsList',
  initialState,
  reducers: {
    addSuburb: (state, action: PayloadAction<string>) => {
      state.suburbs.push(action.payload);
    },
  },
});

export const { addSuburb } = SuburbsListSlice.actions;

export const selectSuburbs = (state: RootState) => state.suburbsList.suburbs;

export default SuburbsListSlice.reducer;
