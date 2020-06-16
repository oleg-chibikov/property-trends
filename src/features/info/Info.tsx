import React from 'react';
import styles from './Info.module.css';
import { RealEstateResponse } from '../featureMap/FeatureMap';

interface InfoProps extends RealEstateResponse {}

const Info: React.FunctionComponent<InfoProps> = (props) => (
  <div className={styles.info}>
    <h1>{props.locality}</h1>
    <div>Post Code: {props.postCode}</div>
    <div>Min: ${props.minPrice}</div>
    <div>Median: ${props.medianPrice}</div>
    <div>Average: ${props.averagePrice}</div>
    <div>95 percentile: ${props.percentile95Price}</div>
    <div>Max: ${props.maxPrice}</div>
    <div>Count: {props.count}</div>
  </div>
);

export default Info;
