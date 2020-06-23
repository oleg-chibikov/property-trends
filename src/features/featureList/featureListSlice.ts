import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { FeatureInfo } from '../../interfaces';

interface HighlightFeatureParams {
  id: string;
  scroll: boolean;
}

interface FeatureListState {
  features: { [id: string]: FeatureInfo };
  highlightedFeatureId?: string;
}

const initialState: FeatureListState = {
  features: {},
  highlightedFeatureId: undefined,
};

export const featureListSlice = createSlice({
  name: 'FeatureList',
  initialState,
  reducers: {
    addFeature: (state, action: PayloadAction<FeatureInfo>) => {
      state.features[action.payload.id] = action.payload;
    },
    removeFeature: (state, action: PayloadAction<string>) => {
      delete state.features[action.payload];
    },
    highlightFeature: (state, action: PayloadAction<HighlightFeatureParams>) => {
      state.features[action.payload.id].isHighlighted = true;
      if (action.payload.scroll) {
        const scrollIntoView = () => {
          const el = document.querySelector('#feature' + action.payload.id);
          if (el) {
            el.scrollIntoView({ block: 'end', behavior: 'auto' });
          }
        };
        scrollIntoView();
      }
    },
    unhighlightFeature: (state, action: PayloadAction<string>) => {
      state.features[action.payload].isHighlighted = false;
    },
  },
});

export const { addFeature, removeFeature, highlightFeature, unhighlightFeature } = featureListSlice.actions;

export const selectFeatures = (state: RootState) => state.featureList.features;
export const selectHighlightedFeature = (state: RootState) => state.featureList.highlightedFeatureId;

export default featureListSlice.reducer;
