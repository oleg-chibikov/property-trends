import React, { useMemo, useCallback, useRef } from 'react';
import { GeoJSON, FeatureGroup } from 'react-leaflet';
import L, { StyleFunction } from 'leaflet';
import Info from '../info/Info';
import { useDispatch } from 'react-redux';
import {
  addFeature,
  highlightFeature,
  unhighlightFeature,
} from '../featureList/featureListSlice';
import Legend from '../legend/Legend';
import Control from 'react-leaflet-control';
import FeatureList from '../featureList/FeatureList';

interface FeaturesMapProps {
  json: GeoJSON.GeoJsonObject;
}

const hashCode = (s: string) => {
  var hash = 0;
  for (var i = 0; i < s.length; i++) {
    var character = s.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

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

const featuresById: { [id: string]: any } = {};

const getColor = (d: number) => {
  const closestMinimal = (needle: number, haystack: number[]) => {
    var i = 0;
    while (haystack[++i] < needle);
    return haystack[--i];
  };
  return pricesToColors[closestMinimal(700, pricesToColorsKeys)];
};

const FeaturesMap: React.FunctionComponent<FeaturesMapProps> = (props) => {
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

  const zoomToFeatureOnMap = useCallback((layer) => {
    geojson.current.leafletElement._map.fitBounds(layer.getBounds());
  }, []);

  const highlightFeatureOnMap = useCallback(
    (layer, scroll: boolean) => {
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

      var name = layer.feature.properties.name;
      setInfo(name);
      const id = layer.feature.properties.id;
      dispatch(highlightFeature({ id, scroll: scroll }));
    },
    [dispatch]
  );

  const unhighlightFeatureOnMap = useCallback(
    (layer) => {
      geojson.current.leafletElement.resetStyle(layer);
      setInfo(undefined);
      const id = layer.feature.properties.id;
      dispatch(unhighlightFeature(id));
    },
    [dispatch]
  );

  const zoomToFeatureHandler = useCallback(
    (e) => {
      const layer = e.target;
      zoomToFeatureOnMap(layer);
    },
    [zoomToFeatureOnMap]
  );

  const highlightFeatureHandler = useCallback(
    (e) => highlightFeatureOnMap(e.target, true),
    [highlightFeatureOnMap]
  );

  const unhighlightFeatureHandler = useCallback(
    (e) => unhighlightFeatureOnMap(e.target),
    [unhighlightFeatureOnMap]
  );

  const onEachFeature = useCallback(
    (feature: GeoJSON.Feature, layer) => {
      layer.on({
        mouseover: highlightFeatureHandler,
        mouseout: unhighlightFeatureHandler,
        click: zoomToFeatureHandler,
      });

      const toTitleCase = (phrase: string) => {
        return phrase
          .toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };

      const bounds = layer.getBounds();
      const properties = layer.feature.properties;
      const name = toTitleCase(properties.Name || properties.name);
      const id =
        name.replace(/\s/g, '-').toLowerCase() +
        '_' +
        hashCode(JSON.stringify(bounds));
      featuresById[id] = layer;
      dispatch(
        addFeature({
          name,
          id,
        })
      );

      properties.name = name;
      properties.id = id;
      var popupContent = `<div>
          ${name} - ${id}
        </div>`;
      layer.bindPopup(popupContent);
    },
    [
      highlightFeatureHandler,
      unhighlightFeatureHandler,
      zoomToFeatureHandler,
      dispatch,
    ]
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
      {useMemo(
        () =>
          info && (
            <Control position="topright">
              <Info info={info} />
            </Control>
          ),
        [info]
      )}
      {useMemo(
        () => (
          <Control position="bottomright">
            <Legend colorsDictionary={pricesToColors} />
          </Control>
        ),
        []
      )}
      {useMemo(() => {
        const zoomToFeatureById = (id: string) => {
          zoomToFeatureOnMap(featuresById[id]);
        };
        const highlightFeatureById = (id: string) => {
          highlightFeatureOnMap(featuresById[id], false);
        };
        const unhighlightFeatureById = (id: string) => {
          unhighlightFeatureOnMap(featuresById[id]);
        };
        return (
          <Control position="topleft">
            <FeatureList
              onFeatureEntryMouseOver={highlightFeatureById}
              onFeatureEntryMouseOut={unhighlightFeatureById}
              onFeatureEntryClick={zoomToFeatureById}
            />
          </Control>
        );
      }, [highlightFeatureOnMap, unhighlightFeatureOnMap, zoomToFeatureOnMap])}
    </React.Fragment>
  );
};

// TODO: cuurent location, search (geocoder)

export default FeaturesMap;
