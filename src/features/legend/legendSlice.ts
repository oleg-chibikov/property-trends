import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PricesToColors } from '../../interfaces';
import { RootState } from '../../app/store';

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
    highlightLegendEntry: (state, action: PayloadAction<number>) => {
      state.pricesToColors[action.payload].isHighlighted = true;
    },
    unhighlightLegendEntry: (state, action: PayloadAction<number>) => {
      state.pricesToColors[action.payload].isHighlighted = false;
    },
  },
});

export const { changePricesToColors, highlightLegendEntry, unhighlightLegendEntry } = LegendSlice.actions;

export const selectPricesToColors = (state: RootState) => state.legend.pricesToColors;

export default LegendSlice.reducer;
