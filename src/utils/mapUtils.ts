import { Map } from 'leaflet';

export default class MapUtils {
  static redrawMap = (map: Map, after?: number | undefined) => {
    setTimeout(function () {
      map.invalidateSize();
      console.log('Redrawn map');
    }, after || 10);
  };
}
