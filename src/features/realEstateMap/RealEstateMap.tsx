import React, { useState } from 'react';
import {
  Map,
  GoogleApiWrapper,
  IProvidedProps,
  IMapProps,
} from 'google-maps-react';
const LoadingContainer = (props: any) => <div>Fancy loading container!</div>;
class RealEstateMap extends React.Component<IMapProps> {
  useTheData(doc: any) {}
  fetchPlaces(mapProps?: IMapProps, map?: google.maps.Map, event?: any) {
    const infoWindow = new google.maps.InfoWindow({
      maxWidth: 500,
    });

    var parser = require('../../custom/geoxml3.js');
    const geoXml = new parser.default({
      map: map,
      singleInfoWindow: true,
      afterParse: this.useTheData,
      // @ts-ignore
      polygonOptions: {
        clickable: true,
        strokeColor: 'black',
        strokeWeight: 1,
        strokeOpacity: 1,
        fillColor: 'Transparent',
        fillOpacity: 0.7,
      },
      //createMarker: createMarker,
      //pmParseFn: parsePlacemark
      //createMarker: addMyMarker,
      //createPolygon: addMyPolygon
    });

    //geoXml.parse('aus_suburb_kml-master/TAS/SOUTHWEST.kml');
    //geoXml.parse('aus_suburb_kml-master/TAS/RISDON.kml');
    //geoXml.parse('aus_suburb_kml-master/TAS/TROWUTTA.kml');
    //geoXml.parse('aus_suburb_kml-master/TAS/HOBART.kml');
    //geoXml.parse('aus_suburb_kml-master/TAS/North HOBART.kml');
    //geoXml.parse('aus_suburb_kml-master/TAS/Battery point.kml');
    //geoXml.parse('aus_suburb_kml-master/TAS/TARLETON.kml');
    //geoXml.parse('aus_suburb_kml-master/TAS/SOUTHWEST.kml');
    // @ts-ignore
    geoXml.parse(
      process.env.PUBLIC_URL + '/aus_suburb_kml-master/NSW/APPIN.kml'
    );
  }

  render() {
    return <Map onReady={this.fetchPlaces} {...this.props}></Map>;
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBCctYFKHEVCC5yaFkbCAjNwgzMGn923hQ',
  LoadingContainer: LoadingContainer,
})(RealEstateMap);
