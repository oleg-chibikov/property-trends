import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Map,
  GoogleApiWrapper,
  IProvidedProps,
  IMapProps,
} from 'google-maps-react';
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from './realEstateMapSlice';
import styles from './RealEstateMap.module.css';
import { Counter } from '../counter/Counter';
class RealEstateMap extends React.Component<IMapProps> {
  render() {
    return <Counter />;
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBCctYFKHEVCC5yaFkbCAjNwgzMGn923hQ',
})(RealEstateMap);
