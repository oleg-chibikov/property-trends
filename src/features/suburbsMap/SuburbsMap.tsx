import React, { useMemo, useCallback, useRef } from 'react';
import { GeoJSON, FeatureGroup } from 'react-leaflet';
import L, { StyleFunction } from 'leaflet';
import Info from '../info/Info';
import { useDispatch } from 'react-redux';
import { addSuburb } from '../suburbsList/suburbsListSlice';
import Legend from '../legend/Legend';

interface SuburbsMapProps {
  json: GeoJSON.GeoJsonObject;
}

const pricesToColors: { [needle: number]: string } = {
  0: '#FFEDA0',
  100000: '#FED976',
  200000: '#FEB24C',
  300000: '#FD8D3C',
  500000: '#FC4E2A',
  750000: '#E31A1C',
  1000000: '#800026',
};
const pricesToColorsKeys = Object.keys(pricesToColors).map(Number);

const getColor = (d: number) => {
  const closestMinimal = (needle: number, haystack: number[]) => {
    var i = 0;
    while (haystack[++i] < needle);
    return haystack[--i];
  };
  return pricesToColors[closestMinimal(700, pricesToColorsKeys)];
};

const SuburbsMap: React.FunctionComponent<SuburbsMapProps> = (props) => {
  const dispatch = useDispatch();
  const geojson = useRef<any>();
  const [info, setInfo] = React.useState<string>();

  const style: StyleFunction<GeoJSON.Feature> = useCallback(
    (feature) => ({
      fillColor: getColor(700),
      weight: 1,
      opacity: 1,
      color: 'dimgray',
      dashArray: '3',
      fillOpacity: 0.7,
    }),
    []
  );

  const zoomToFeature = useCallback((e) => {
    e.target._map.fitBounds(e.target.getBounds());
  }, []);

  const highlightFeature = useCallback((e) => {
    const layer = e.target;
    layer.setStyle({
      // weight: 1,
      //color: 'dimgray',
      fillColor: 'yellow',
      dashArray: '',
      fillOpacity: 0.3,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    setInfo(layer.feature.properties.popupContent);
  }, []);

  const removeHighlightFromFeature = useCallback((e) => {
    const layer = e.target;
    geojson.current.leafletElement.resetStyle(layer);
    setInfo(undefined);
  }, []);

  const onEachFeature = useCallback(
    (feature, layer) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: removeHighlightFromFeature,
        click: zoomToFeature,
      });

      const toTitleCase = (phrase: string) => {
        return phrase
          .toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };

      const properties = layer.feature.properties;
      const name = properties.Name || properties.name;

      let popupContent = toTitleCase(name);
      dispatch(addSuburb(popupContent));

      properties.popupContent = popupContent;
      layer.bindPopup(popupContent);
    },
    [highlightFeature, removeHighlightFromFeature, zoomToFeature, dispatch]
  );

  const onFeatureGroupAdd = useCallback((e) => {
    e.target._map.fitBounds(e.target.getBounds());
    // this.refs.map.leafletElement.fitBounds();
  }, []);

  return (
    <React.Fragment>
      {useMemo(
        () => (
          <FeatureGroup onAdd={onFeatureGroupAdd}>
            <GeoJSON
              style={style}
              ref={geojson}
              data={props.json}
              onEachFeature={onEachFeature}
            />
          </FeatureGroup>
        ),
        [props.json, onEachFeature, onFeatureGroupAdd, style]
      )}
      {useMemo(() => info && <Info info={info} />, [info])}
      {useMemo(
        () => (
          <Legend colorsDictionary={pricesToColors} />
        ),
        []
      )}
    </React.Fragment>
  );
};

export default SuburbsMap;
