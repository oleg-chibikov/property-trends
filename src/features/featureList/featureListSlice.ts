import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface FeatureInfo {
  name: string;
  id: string;
  isHighlighted?: boolean;
}

export interface FeatureHandlers {
  onFeatureEntryMouseOver: (id: string) => any;
  onFeatureEntryMouseOut: (id: string) => any;
  onFeatureEntryClick: (id: string) => any;
}

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

export const FeatureListSlice = createSlice({
  name: 'FeatureList',
  initialState,
  reducers: {
    addFeature: (state, action: PayloadAction<FeatureInfo>) => {
      state.features[action.payload.id] = action.payload;
    },
    highlightFeature: (
      state,
      action: PayloadAction<HighlightFeatureParams>
    ) => {
      state.features[action.payload.id].isHighlighted = true;
      if (action.payload.scroll) {
        const scrollIntoView = () => {
          const el = document.querySelector('#feature' + action.payload.id);
          if (el) {
            el.scrollIntoView({ block: 'center', behavior: 'smooth' });
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

export const {
  addFeature,
  highlightFeature,
  unhighlightFeature,
} = FeatureListSlice.actions;

export const selectFeatures = (state: RootState) => state.FeatureList.features;
export const selectHighlightedFeature = (state: RootState) =>
  state.FeatureList.highlightedFeatureId;

export default FeatureListSlice.reducer;
