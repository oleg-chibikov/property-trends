import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { PricesToColors } from '../../interfaces';

interface LegendState {
  pricesToColors: PricesToColors;
  highlightedPrices: { [intervalMinPrice: number]: number };
}

const initialState: LegendState = {
  pricesToColors: {},
  highlightedPrices: {},
};

export const legendSlice = createSlice({
  name: 'Legend',
  initialState,
  reducers: {
    changePricesToColors: (state, action: PayloadAction<PricesToColors>) => {
      state.pricesToColors = action.payload;
    },
    highlightLegendEntry: (state, action: PayloadAction<number>) => {
      state.highlightedPrices[action.payload] = 0;
    },
    unhighlightLegendEntry: (state, action: PayloadAction<number>) => {
      delete state.highlightedPrices[action.payload];
    },
  },
});

export const { changePricesToColors, highlightLegendEntry, unhighlightLegendEntry } = legendSlice.actions;

export const selectPricesToColors = (state: RootState) => state.legend.pricesToColors;
export const selectHighlightedPrices = (state: RootState) => state.legend.highlightedPrices;

export default legendSlice.reducer;
