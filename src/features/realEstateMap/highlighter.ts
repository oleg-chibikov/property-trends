import { Dispatch } from 'react';
import { GeoJSON } from 'react-leaflet';
import { CustomLayer, FeatureProperties } from '../../interfaces';
import { clearInfo, setInfo } from '../info/infoSlice';
import { highlightLegendEntry, unhighlightLegendEntry } from '../legend/legendSlice';
import { highlightSuburb, unhighlightSuburb } from '../suburbList/suburbListSlice';
class Highlighter {
  private dispatch: Dispatch<any>;
  private geoJsonElement: GeoJSON;
  private currentlyHighlightedLayers: { [suburbId: string]: CustomLayer } = {};

  constructor(dispatch: Dispatch<any>, geoJsonElement: GeoJSON) {
    this.dispatch = dispatch;
    this.geoJsonElement = geoJsonElement;
  }

  highlightLayer = (layer: CustomLayer, cleanup = true) => {
    if (!layer) {
      return;
    }

    if (cleanup) {
      this.cleanupPreviousHighlight();
    }

    const properties = layer.feature.properties;
    const suburbId = properties.suburbId;
    this.highlightLayerOnMap(layer);
    this.showInfo(properties);
    this.highlightSuburbInLegend(properties);
    this.highlightSuburbInList(suburbId);
    this.currentlyHighlightedLayers[suburbId] = layer;
  };

  unhighlightLayer = (layer: CustomLayer) => {
    if (!layer) {
      return;
    }
    const properties = layer.feature.properties;
    const suburbId = properties.suburbId;
    this.unhighlightLayerOnMap(layer);
    this.hideInfo();
    this.unhighlightSuburbInList(suburbId);
    this.unhighlightSuburbInLegend(properties);
    delete this.currentlyHighlightedLayers[suburbId];
  };

  cleanupPreviousHighlight = () => {
    for (const highlightedLayer of Object.keys(this.currentlyHighlightedLayers)) {
      this.unhighlightLayer(this.currentlyHighlightedLayers[highlightedLayer]);
    }
    this.currentlyHighlightedLayers = {};
  };

  private showInfo = (properties: FeatureProperties) => {
    const priceData = properties.priceData;
    this.dispatch(
      setInfo({
        fileName: properties.fileName,
        locality: properties.locality,
        suburbId: properties.suburbId,
        postCode: properties.postCode,
        state: properties.state,
        district: properties.district,
        priceData: priceData && {
          medianPrice: priceData.medianPrice,
          minPrice: priceData.minPrice,
          averagePrice: priceData.averagePrice,
          maxPrice: priceData.maxPrice,
          percentile95Price: priceData.percentile95Price,
          count: priceData.count,
        },
      })
    );
  };

  private hideInfo = () => {
    this.dispatch(clearInfo());
  };

  private highlightSuburbInList = (suburbId: string) => {
    this.dispatch(highlightSuburb(suburbId));
  };

  private unhighlightSuburbInList = (suburbId: string) => {
    this.dispatch(unhighlightSuburb(suburbId));
  };

  private highlightSuburbInLegend = (properties: FeatureProperties) => {
    if (properties.priceData?.priceIntrevalInfo) {
      this.dispatch(highlightLegendEntry(properties.priceData.priceIntrevalInfo.intervalMinPrice));
    }
  };

  private unhighlightSuburbInLegend = (properties: FeatureProperties) => {
    if (properties.priceData?.priceIntrevalInfo) {
      this.dispatch(unhighlightLegendEntry(properties.priceData.priceIntrevalInfo.intervalMinPrice));
    }
  };

  private highlightLayerOnMap = (layer: CustomLayer) => {
    layer.setStyle({
      weight: 3,
      color: 'black',
      opacity: 1,
      //fillColor: 'magenta',
      dashArray: '',
      //fillOpacity: 0.3,
    });
  };

  private unhighlightLayerOnMap = (layer: CustomLayer) => {
    this.geoJsonElement.leafletElement.resetStyle(layer);
  };
}

export default Highlighter;
