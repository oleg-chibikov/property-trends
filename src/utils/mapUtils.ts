import { Map } from 'leaflet';

export default class MapUtils {
  static redrawMap = (map: Map, after?: number | undefined) => {
    setTimeout(function () {
      map.invalidateSize();
      console.log('Redrawed map');
    }, after || 10);
  };
}
