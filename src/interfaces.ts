import { LeafletMouseEvent, Map, Polygon } from 'leaflet';

export interface PriceIntrevalInfo {
  intervalMinPrice: number;
  color: string;
  suburbCount: number;
}

export interface RealEstateResponse {
  postCode: number;
  locality: string;
  medianPrice: number;
  minPrice: number;
  averagePrice: number;
  maxPrice: number;
  percentile95Price: number;
  count: number;
  priceIntrevalInfo: PriceIntrevalInfo;
  suburbId: string;
}

export interface HistoryEntry {
  date: string;
  medianPrice: number;
  minPrice: number;
  averagePrice: number;
  maxPrice: number;
  percentile95Price: number;
  count: number;
}

export interface RealEstateEntry {
  minPrice: number;
  maxPrice?: number;
  propertyName?: string;
  streetAddress?: string;
  latitude?: number;
  longitude?: number;
  id: number;
}

export interface CustomLayer extends Polygon<FeatureProperties> {
  feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, FeatureProperties>;
}

export interface CompoundLayer extends Polygon {
  getLayers: () => CustomLayer[];
}

export interface EventArgs<T> extends LeafletMouseEvent {
  target: T;
}

export interface SuburbInfo {
  name: string;
  suburbId: string;
  isHighlighted?: boolean;
  color?: string;
}

export interface SuburbKey {
  postCode: number;
  locality: string;
}

export interface SuburbKeyWithState extends SuburbKey {
  state: string;
}

export interface LegendEntryEventHandlers {
  onItemClick: (subIntervalMinPrice: number) => void;
  onItemMouseOut: (subIntervalMinPrice: number) => void;
}

export interface SuburbListEntryEventHandlers {
  onItemMouseOver: (suburbId: string) => void;
  onItemMouseOut: (suburbId: string) => void;
  onItemClick: (suburbId: string) => void;
}

export interface NewFeatureProperties {
  name: string;
  Name?: string;
  description: string;
}

export interface FeatureProperties {
  fileName: string;
  locality: string;
  tooltipContent: string;
  suburbId: string;
  priceData?: RealEstateResponse;
  postCode: number;
  state: string;
  district: string;
}

export interface StateAndDistrict {
  state: string;
  district: string;
}

export interface InfoData {
  fileName: string;
  locality: string;
  suburbId: string;
  postCode: number;
  state: string;
  district: string;
  priceData?: InfoPriceData;
}

export interface InfoPriceData {
  medianPrice: number;
  minPrice: number;
  averagePrice: number;
  maxPrice: number;
  percentile95Price: number;
  count: number;
}

export interface WithFeatures extends GeoJSON.GeoJsonObject {
  features: GeoJSON.Feature<GeoJSON.Geometry, FeatureProperties>[];
}

export interface PricesToColors {
  [intervalMinPrice: number]: PriceIntrevalInfo;
}

export interface PostCodeFileInfo {
  state: string;
  outerDistrict: string;
  innerDistrict: string;
  locality: string;
  postCode: number;
}

export interface WithMap {
  leafletMap: Map;
}

export interface MapFilters {
  dealType: string;
  propertyType: string;
  bedrooms: number | number[];
  bathrooms: number | number[];
  parkingSpaces: number | number[];
  constructionStatus: string;
  allowedWindowInDays: number;
  mainPriceOnly: boolean;
  modernOnly: boolean;
  includeSold: boolean;
}

export interface ChartData {
  date: Date;
  median: number;
  count: number;
  min: number;
  max: number;
}
