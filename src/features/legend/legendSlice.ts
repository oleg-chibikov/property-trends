import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { PricesToColors } from '../../interfaces';

interface LegendState {
  pricesToColors: PricesToColors;
}

const initialState: LegendState = {
  pricesToColors: {},
};

export const legendSlice = createSlice({
  name: 'Legend',
  initialState,
  reducers: {
    changePricesToColors: (state, action: PayloadAction<PricesToColors>) => {
      state.pricesToColors = action.payload;
    },
    highlightLegendEntry: (state, action: PayloadAction<number>) => {
      const legendEntry = state.pricesToColors[action.payload];
      if (legendEntry) {
        legendEntry.isHighlighted = true;
      }
    },
    unhighlightLegendEntry: (state, action: PayloadAction<number>) => {
      const legendEntry = state.pricesToColors[action.payload];
      if (legendEntry) {
        legendEntry.isHighlighted = false;
      }
    },
  },
});

export const { changePricesToColors, highlightLegendEntry, unhighlightLegendEntry } = legendSlice.actions;

export const selectPricesToColors = (state: RootState) => state.legend.pricesToColors;

export default legendSlice.reducer;
