import { LatLngBounds, Map } from 'leaflet';
import { Dispatch } from 'react';
import { CustomLayer, EventArgs } from '../../interfaces';
import DomainUtils from '../../utils/domainUtils';
import { removeSearchResult } from '../search/searchBoxSlice';
import { scrollToSuburb } from '../suburbList/suburbListSlice';
import Highlighter from './highlighter';

class SuburbMapEventHandler {
  private dispatch: Dispatch<any>;
  private mapElement: Map;
  private highlighter: Highlighter;
  private layersBySuburbId: { [suburbId: string]: CustomLayer };
  private suburbIdsByPriceInterval: { [price: number]: string[] } = {};
  private layerPressTimer: number | undefined;

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
    this.mapElement?.panTo([coords.latitude, coords.longitude]);
    //this.mapElement?.setView([coords.latitude, coords.longitude], 11);
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

  onSuburbListEntryClick = (suburbId: string) => {
    const layer = this.layersBySuburbId[suburbId];
    this.zoomToLayerOnMap(layer);
    this.highlighter.highlightLayer(layer);
    this.scrollToSuburbInList(suburbId);
  };

  onSuburbListEntryMouseOver = (suburbId: string) => {
    this.highlighter.highlightLayer(this.layersBySuburbId[suburbId]);
  };

  onSuburbListEntryMouseOut = (suburbId: string) => {
    this.highlighter.unhighlightLayer(this.layersBySuburbId[suburbId]);
  };

  onLegendEntryClick = (intervalMinPrice: number) => {
    this.highlighter.cleanupPreviousHighlight();
    let combinedBounds: LatLngBounds | undefined = undefined;
    this.applyByPriceInterval(intervalMinPrice, (suburbId) => {
      const layer = this.layersBySuburbId[suburbId];
      this.highlighter.highlightLayer(layer, false);
      if (combinedBounds) {
        combinedBounds.extend(layer.getBounds());
      } else {
        combinedBounds = layer.getBounds();
      }
    });
    this.showBounds(combinedBounds);
  };

  onLegendEntryMouseOut = (intervalMinPrice: number) => {
    this.applyByPriceInterval(intervalMinPrice, (suburbId) => {
      this.highlighter.unhighlightLayer(this.layersBySuburbId[suburbId]);
    });
  };

  onSearchBoxHighlightedStatusChange = (suburbId: string | undefined, previousSuburbId: string | undefined) => {
    if (suburbId) {
      this.highlighter.highlightLayer(this.layersBySuburbId[suburbId]);
    } else if (previousSuburbId) {
      this.highlighter.unhighlightLayer(this.layersBySuburbId[previousSuburbId]);
    }
  };

  onSearchBoxSelectedItemChange = (suburbId: string | undefined) => {
    if (suburbId) {
      const layer = this.layersBySuburbId[suburbId];
      if (layer) {
        this.zoomToLayerOnMap(layer);
        this.highlighter.highlightLayer(layer);
        this.scrollToSuburbInList(suburbId);
        this.dispatch(removeSearchResult());
        return true;
      }
    }
    return false;
  };

  onLayerMouseOver = (e: EventArgs<CustomLayer>) => {
    const layer = e.target;
    this.highlighter.highlightLayer(layer);
    const properties = layer.feature.properties;
    const suburbId = properties.suburbId;
    this.scrollToSuburbInList(suburbId);
  };

  onLayerMouseOut = (e: EventArgs<CustomLayer>) => {
    const layer = e.target;
    this.highlighter.unhighlightLayer(layer);
  };

  onLayerClick = (e: EventArgs<CustomLayer>) => {
    const layer = e.target;
    const properties = layer.feature.properties;
    this.highlighter.highlightLayer(layer);
    this.scrollToSuburbInList(properties.suburbId);
  };

  onLayerDoubleClick = (e: EventArgs<CustomLayer>) => {
    const layer = e.target;
    const properties = layer.feature.properties;
    const formattedPostcode = DomainUtils.padPostCode(properties.postCode);
    const win = window.open(DomainUtils.getRealEstateSuburbUri(properties.name, formattedPostcode, properties.state), '_blank');
    win?.focus();
    (e as any).originalEvent.view.L.DomEvent.stopPropagation(e);
  };

  onLayerMouseDown = (e: EventArgs<CustomLayer>) => {
    // const layer = e.target;
    // const properties = layer.feature.properties;
    // this.layerPressTimer = window.setTimeout(function () {
    //   const formattedPostcode = DomainUtils.padPostCode(properties.postCode);
    //   const win = window.open(DomainUtils.getRealEstateSuburbUri(properties.name, formattedPostcode, properties.state), '_blank');
    //   win?.focus();
    // }, 1000);
    // return false;
  };

  onLayerMouseUp = (e: EventArgs<CustomLayer>) => {
    // if (this.layerPressTimer) {
    //   clearTimeout(this.layerPressTimer);
    //   this.layerPressTimer = undefined;
    // }
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
