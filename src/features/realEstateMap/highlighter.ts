import L from 'leaflet';
import { Dispatch } from 'react';
import { GeoJSON } from 'react-leaflet';
import { CustomLayer, FeatureProperties } from '../../interfaces';
import { clearInfo, setInfo } from '../info/infoSlice';
import { highlightLegendEntry, unhighlightLegendEntry } from '../legend/legendSlice';
import { highlightSuburb, unhighlightSuburb } from '../suburbList/suburbListSlice';

class Highlighter {
  private dispatch: Dispatch<any>;
  private geoJsonElement: GeoJSON;
  constructor(dispatch: Dispatch<any>, geoJsonElement: GeoJSON) {
    this.dispatch = dispatch;
    this.geoJsonElement = geoJsonElement;
  }

  highlightAll = (layer: CustomLayer) => {
    if (!layer) {
      return;
    }
    const properties = layer.feature.properties;
    const suburbId = properties.suburbId;
    this.highlightLayerOnMap(layer);
    this.showInfo(properties);
    this.highlightSuburbInLegend(properties);
    this.highlightSuburbInList(suburbId);
  };

  unhighlightAll = (layer: CustomLayer) => {
    if (!layer) {
      return;
    }
    const properties = layer.feature.properties;
    const suburbId = properties.suburbId;
    this.unhighlightLayerOnMap(layer);
    this.hideInfo();
    this.unhighlightSuburbInList(suburbId);
    this.unhighlightSuburbInLegend(properties);
  };

  private showInfo = (properties: FeatureProperties) => {
    const copy = { ...properties };
    this.dispatch(setInfo(copy));
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
      //fillColor: 'magenta',
      dashArray: '',
      //fillOpacity: 0.3,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  private unhighlightLayerOnMap = (layer: CustomLayer) => {
    this.geoJsonElement.leafletElement.resetStyle(layer);
  };
}

export default Highlighter;
