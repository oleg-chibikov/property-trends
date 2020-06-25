import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { PricesToColors } from '../../interfaces';

interface LegendState {
  pricesToColors: PricesToColors;
}

const initialState: LegendState = {
  pricesToColors: {},
};

export const LegendSlice = createSlice({
  name: 'Legend',
  initialState,
  reducers: {
    changePricesToColors: (state, action: PayloadAction<PricesToColors>) => {
      state.pricesToColors = action.payload;
    },
  },
});

export const { changePricesToColors } = LegendSlice.actions;

export const selectPricesToColors = (state: RootState) => state.legend.pricesToColors;

export default LegendSlice.reducer;
