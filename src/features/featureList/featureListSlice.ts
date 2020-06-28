import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { FeatureInfo } from '../../interfaces';

interface HighlightFeatureParams {
  suburbId: string;
  scroll: boolean;
}

interface FeatureListState {
  features: { [suburbId: string]: FeatureInfo };
}

const initialState: FeatureListState = {
  features: {},
};

export const featureListSlice = createSlice({
  name: 'FeatureList',
  initialState,
  reducers: {
    addFeature: (state, action: PayloadAction<FeatureInfo>) => {
      state.features[action.payload.suburbId] = action.payload;
    },
    removeFeature: (state, action: PayloadAction<string>) => {
      delete state.features[action.payload];
    },
    highlightFeature: (state, action: PayloadAction<HighlightFeatureParams>) => {
      state.features[action.payload.suburbId].isHighlighted = true;
      if (action.payload.scroll) {
        const scrollIntoView = () => {
          const el = document.querySelector('#feature' + action.payload.suburbId);
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
    setFeatureColor: (state, action: PayloadAction<{ suburbId: string; color: string }>) => {
      state.features[action.payload.suburbId].color = action.payload.color;
    },
  },
});

export const { addFeature, removeFeature, highlightFeature, unhighlightFeature, setFeatureColor } = featureListSlice.actions;

export const selectFeatures = (state: RootState) => state.featureList.features;

export default featureListSlice.reducer;
