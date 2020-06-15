import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface SuburbsListControlState {
  suburbs: string[];
}

const initialState: SuburbsListControlState = {
  suburbs: [],
};

export const SuburbsListControlSlice = createSlice({
  name: 'SuburbsListControl',
  initialState,
  reducers: {
    addSuburb: (state, action: PayloadAction<string>) => {
      state.suburbs.push(action.payload);
    },
  },
});

export const { addSuburb } = SuburbsListControlSlice.actions;

export const selectSuburbs = (state: RootState) =>
  state.suburbsListControl.suburbs;

export default SuburbsListControlSlice.reducer;
