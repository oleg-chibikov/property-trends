import { Polygon } from 'leaflet';

export interface RealEstateResponse {
  postCode: number;
  locality: string;
  medianPrice: number;
  minPrice: number;
  averagePrice: number;
  maxPrice: number;
  percentile95Price: number;
  count: number;
}

export interface CustomLayer extends Polygon<FeatureProperties> {
  popupContent: string;
  feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, FeatureProperties>;
}

export interface CompoundLayer extends Polygon {
  getLayers: () => CustomLayer[];
}

export interface EventArgs<T> {
  target: T;
}

export interface FeatureInfo {
  name: string;
  id: string;
  isHighlighted?: boolean;
}

export interface FeatureHandlers {
  onFeatureEntryMouseOver: (id: string) => void;
  onFeatureEntryMouseOut: (id: string) => void;
  onFeatureEntryClick: (id: string) => void;
}

export interface FeatureProperties {
  fileName: string;
  name: string;
  Name?: string;
  popupContent: string;
  id: string;
  priceDataForFeature?: RealEstateResponse;
  description: number;
}

export interface WithFeatures extends GeoJSON.GeoJsonObject {
  features: GeoJSON.Feature<GeoJSON.Geometry, FeatureProperties>[];
}
