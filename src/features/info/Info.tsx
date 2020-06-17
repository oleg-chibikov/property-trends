import React from 'react';
import styles from './Info.module.css';
import { RealEstateResponse } from '../featureMap/FeatureMap';

interface InfoProps extends RealEstateResponse {}

const Info: React.FunctionComponent<InfoProps> = (props) => (
  <div className={styles.info}>
    <h4>{props.locality}</h4>
    {props.postCode && <div>Post Code: {props.postCode}</div>}
    {props.minPrice && <div>Min: ${props.minPrice}</div>}
    {props.medianPrice && <div>Median: ${props.medianPrice}</div>}
    {props.averagePrice && <div>Average: ${props.averagePrice}</div>}
    {props.percentile95Price && (
      <div>95 percentile: ${props.percentile95Price}</div>
    )}
    {props.maxPrice && <div>Max: ${props.maxPrice}</div>}
    {props.count && <div>Count: {props.count}</div>}
  </div>
);

export default Info;
