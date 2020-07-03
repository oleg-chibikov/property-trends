import { LatLngBounds, Map } from 'leaflet';
import { Dispatch } from 'react';
import { CustomLayer, EventArgs } from '../../interfaces';
import { scrollToSuburb } from '../suburbList/suburbListSlice';
import Highlighter from './highlighter';

class SuburbMapEventHandler {
  private dispatch: Dispatch<any>;
  private mapElement: Map;
  private highlighter: Highlighter;
  private layersBySuburbId: { [suburbId: string]: CustomLayer };
  private suburbIdsByPriceInterval: { [price: number]: string[] } = {};

  constructor(dispatch: Dispatch<any>, mapElement: Map, highlighter: Highlighter, layersBySuburbId: { [suburbId: string]: CustomLayer }) {
    this.dispatch = dispatch;
    this.mapElement = mapElement;
    this.highlighter = highlighter;
    this.layersBySuburbId = layersBySuburbId;
  }

  showBounds = (bounds: LatLngBounds | undefined) => {
    if (bounds && bounds.isValid()) {
      this.mapElement.fitBounds(bounds);
    }
  };

  showLocation = (coords: Coordinates) => {
    this.mapElement?.setView([coords.latitude, coords.longitude], 11);
  };

  setSuburbIdsByPriceInterval(obj: { [price: number]: string[] }) {
    this.suburbIdsByPriceInterval = obj;
  }

  scrollToSuburbInList = (suburbId: string) => {
    this.dispatch(scrollToSuburb(suburbId));
  };

  zoomToLayerOnMap = (layer: CustomLayer) => {
    if (!layer) {
      return;
    }
    this.mapElement?.fitBounds(layer.getBounds());
  };

  onSuburbListClick = (suburbId: string) => {
    this.zoomToLayerOnMap(this.layersBySuburbId[suburbId]);
  };

  onSuburbListMouseOver = (suburbId: string) => {
    this.highlighter.highlightAll(this.layersBySuburbId[suburbId]);
  };

  onSuburbListMouseOut = (suburbId: string) => {
    this.highlighter.unhighlightAll(this.layersBySuburbId[suburbId]);
  };

  onLegendEntryMouseOver = (intervalMinPrice: number) => {
    this.applyByPriceInterval(intervalMinPrice, (suburbId) => {
      this.highlighter.highlightAll(this.layersBySuburbId[suburbId]);
    });
  };

  onLegendEntryMouseOut = (intervalMinPrice: number) => {
    this.applyByPriceInterval(intervalMinPrice, (suburbId) => {
      this.highlighter.unhighlightAll(this.layersBySuburbId[suburbId]);
    });
  };

  onSearchBoxHighlightedStatusChange = (suburbId: string | undefined, previousSuburbId: string | undefined) => {
    if (suburbId) {
      this.highlighter.highlightAll(this.layersBySuburbId[suburbId]);
    } else if (previousSuburbId) {
      this.highlighter.unhighlightAll(this.layersBySuburbId[previousSuburbId]);
    }
  };

  onSearchBoxSelectedItemChange = (suburbId: string | undefined) => {
    if (suburbId) {
      const layer = this.layersBySuburbId[suburbId];
      if (layer) {
        this.zoomToLayerOnMap(layer);
        this.highlighter.highlightAll(layer);
        this.scrollToSuburbInList(suburbId);
        return true;
      }
    }
    return false;
  };

  onLayerMouseOver = (e: EventArgs<CustomLayer>) => {
    const layer = e.target;
    this.highlighter.highlightAll(layer);
    const properties = layer.feature.properties;
    const suburbId = properties.suburbId;
    this.scrollToSuburbInList(suburbId);
  };

  onLayerMouseOut = (e: EventArgs<CustomLayer>) => {
    const layer = e.target;
    this.highlighter.unhighlightAll(layer);
  };

  onLayerClick = (e: EventArgs<CustomLayer>) => {
    const layer = e.target;
    this.zoomToLayerOnMap(layer);
  };

  private applyByPriceInterval = (intervalMinPrice: number, func: (suburbId: string) => void) => {
    const suburbIds = this.suburbIdsByPriceInterval[intervalMinPrice];
    if (suburbIds) {
      for (const suburbId of suburbIds) {
        func(suburbId);
      }
    }
  };
}

export default SuburbMapEventHandler;
