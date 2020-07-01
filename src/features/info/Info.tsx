import { FeatureProperties } from '../../interfaces';
import { selectInfo } from './infoSlice';
import { useSelector } from 'react-redux';
import MoneyUtils from '../../utils/moneyUtils';
import React from 'react';
import StringUtils from '../../utils/stringUtils';
import styles from './Info.module.css';

const Info: React.FunctionComponent = () => {
  const info = useSelector(selectInfo).currentInfo;

  const renderAdditionalInfo = (info: FeatureProperties) =>
    info.priceData && (
      <React.Fragment>
        <div>Min: {MoneyUtils.format(info.priceData.minPrice)}</div>
        <div>Median: {MoneyUtils.format(info.priceData.medianPrice)}</div>
        <div>Average: {MoneyUtils.format(info.priceData.averagePrice)}</div>
        <div>95 percentile: {MoneyUtils.format(info.priceData.percentile95Price)}</div>
        <div>Max: {MoneyUtils.format(info.priceData.maxPrice)}</div>
        <div>Count: {info.priceData.count}</div>
      </React.Fragment>
    );
  return info ? (
    <div className={styles.info}>
      <h6>{info.name}</h6>
      {info.postCode && <div>Post Code: {info.postCode}</div>}
      <div>District: {StringUtils.removePostfix(info.fileName)}</div>
      {renderAdditionalInfo(info)}
    </div>
  ) : null;
};

export default React.memo(Info);
