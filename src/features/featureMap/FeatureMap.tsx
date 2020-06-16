import React, { useMemo, useCallback, useRef, useEffect } from 'react';
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
import HashingUtils from '../../utils/hashingUtils';
import StringUtils from '../../utils/stringUtils';
import axios from 'axios';
import ReactDOMServer from 'react-dom/server';

export interface RealEstateResponse {
  postCode?: number;
  locality: string;
  medianPrice?: number;
  minPrice?: number;
  averagePrice?: number;
  maxPrice?: number;
  percentile95Price?: number;
  count?: number;
}

interface FeatureMapProps {
  polygonData: GeoJSON.GeoJsonObject;
  priceData?: RealEstateResponse;
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

const featuresById: { [id: string]: any } = {};

const getColor = (price: number) => {
  const closestMinimal = (needle: number, haystack: number[]) => {
    var i = 0;
    while (haystack[++i] < needle);
    return haystack[--i];
  };
  return pricesToColors[closestMinimal(price, pricesToColorsKeys)];
};

const getId = (name: string, layer: any) =>
  StringUtils.removeWhitespace(name).toLowerCase() +
  '_' +
  HashingUtils.hashCode(JSON.stringify(layer.getBounds()));

const FeatureMap: React.FunctionComponent<FeatureMapProps> = (props) => {
  const dispatch = useDispatch();
  const geojson = useRef<any>();
  const [info, setInfo] = React.useState<RealEstateResponse>();
  const [priceData, setPriceData] = React.useState<{
    [characterName: string]: RealEstateResponse;
  }>();

  useEffect(() => {
    const getRealEstateDictionary = (priceDataArray: RealEstateResponse[]) => {
      if (!priceDataArray) {
        return {};
      }
      const realEstateDictionary: {
        [characterName: string]: RealEstateResponse;
      } = {};
      for (const element of priceDataArray) {
        realEstateDictionary[
          StringUtils.toTitleCase(element.locality)
        ] = element;
      }
      return realEstateDictionary;
    };

    const fetchPriceData = async () => {
      const url =
        process.env.REACT_APP_PRICES_API_URL +
        'RealEstate?postCodeMin=2600&postCodeMax=3000&allowedWindowInDays=7&mainPriceOnly=true&bedroomsMin=1&bedroomsMax=5&bathroomsMin=1&bathroomsMax=5&parkingSpacesMin=1&parkingSpacesMax=5';
      const priceDataResponse = await axios.get<RealEstateResponse[]>(url);
      setPriceData(getRealEstateDictionary(priceDataResponse.data));
    };
    fetchPriceData();
  }, []);

  const applyStyle: StyleFunction = useCallback(
    (feature) => {
      const priceDataForFeature =
        priceData && feature && priceData[feature.properties.name];
      if (feature && priceDataForFeature) {
        feature.properties.priceInfo = priceDataForFeature;
      }
      if (
        feature &&
        feature.properties.setPopupContent &&
        priceDataForFeature
      ) {
        const priceInfo = priceDataForFeature && (
          <Info {...priceDataForFeature} />
        );
        feature.properties.setPopupContent(
          ReactDOMServer.renderToStaticMarkup(priceInfo)
        );
      }

      const medianPrice = priceDataForFeature?.medianPrice;
      console.log(
        'price for ' + feature?.properties.name + ': ' + medianPrice || -1
      );
      return {
        fillColor: medianPrice ? getColor(medianPrice) : 'transparent',
        weight: 1,
        opacity: 1,
        color: 'dimgray',
        dashArray: '3',
        fillOpacity: 0.7,
      };
    },
    [priceData]
  );

  const zoomToFeatureOnMap = useCallback((layer) => {
    geojson.current.leafletElement._map.fitBounds(layer.getBounds());
  }, []);

  const highlightFeatureOnMap = useCallback(
    (layer, scroll: boolean) => {
      layer.setStyle({
        // weight: 1,
        //color: 'dimgray',
        fillColor: 'magenta',
        dashArray: '',
        fillOpacity: 0.3,
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }

      var priceInfo = layer.feature.properties.priceInfo;
      setInfo(priceInfo);
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

      const properties = layer.feature.properties;
      const name = StringUtils.toTitleCase(properties.Name || properties.name);
      const id = getId(name, layer);

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
      properties.popupContent = popupContent;
      properties.setPopupContent = (popupContent: string) => {
        layer.setPopupContent(popupContent);
        layer.popupContent = popupContent;
      };
      properties.priceInfo = { locality: name };
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
              style={applyStyle}
              ref={geojson}
              data={props.polygonData}
              onEachFeature={onEachFeature}
            />
          </FeatureGroup>
        ),
        [props.polygonData, onEachFeature, onFeatureGroupAdd, applyStyle]
      )}
      {useMemo(
        () =>
          info && (
            <Control position="topright">
              <Info {...info} />
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

export default FeatureMap;
