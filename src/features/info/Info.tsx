import React from 'react';
import styles from './Info.module.css';
import { selectInfo } from './infoSlice';
import { useSelector } from 'react-redux';
import MoneyUtils from '../../utils/moneyUtils';

const Info: React.FunctionComponent = () => {
  const info = useSelector(selectInfo).currentInfo;
  return info ? (
    <div className={styles.info}>
      <h6>{info.locality}</h6>
      {info.postCode && <div>Post Code: {info.postCode}</div>}
      {info.minPrice && <div>Min: {MoneyUtils.format(info.minPrice)}</div>}
      {info.medianPrice && <div>Median: {MoneyUtils.format(info.medianPrice)}</div>}
      {info.averagePrice && <div>Average: {MoneyUtils.format(info.averagePrice)}</div>}
      {info.percentile95Price && <div>95 percentile: {MoneyUtils.format(info.percentile95Price)}</div>}
      {info.maxPrice && <div>Max: {MoneyUtils.format(info.maxPrice)}</div>}
      {info.count && <div>Count: {info.count}</div>}
    </div>
  ) : null;
};

export default React.memo(Info);
