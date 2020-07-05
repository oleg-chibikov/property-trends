import { Typography } from '@material-ui/core';
import Apartment from '@material-ui/icons/Apartment';
import Home from '@material-ui/icons/Home';
import React from 'react';
import { useSelector } from 'react-redux';
import { FeatureProperties } from '../../interfaces';
import MoneyUtils from '../../utils/moneyUtils';
import StringUtils from '../../utils/stringUtils';
import { selectFilters } from '../filters/filtersSlice';
import styles from './Info.module.css';
import { selectInfo } from './infoSlice';

const Info: React.FunctionComponent = () => {
  const info = useSelector(selectInfo).currentInfo;
  const filters = useSelector(selectFilters);
  const isApartment = filters.propertyType === 'apartment';

  const renderAdditionalInfo = (info: FeatureProperties) =>
    info.priceData && (
      <React.Fragment>
        <div>
          {MoneyUtils.format(info.priceData.minPrice)} - {MoneyUtils.format(info.priceData.maxPrice)}
        </div>
        <div>
          <strong>Median: {MoneyUtils.format(info.priceData.medianPrice)}</strong>
        </div>
        <div>Average: {MoneyUtils.format(info.priceData.averagePrice)}</div>
        <div>95 percentile: {MoneyUtils.format(info.priceData.percentile95Price)}</div>
        <div>
          {info.priceData.count} {isApartment ? <Apartment /> : <Home />}
        </div>
      </React.Fragment>
    );
  return info ? (
    <Typography variant="body2" component="div" className={styles.info}>
      <h4>{info.name}</h4>
      {info.postCode && <div>Post Code: {StringUtils.padPostCode(info.postCode)}</div>}
      <div>{StringUtils.removePostfix(info.fileName)}</div>
      {renderAdditionalInfo(info)}
    </Typography>
  ) : null;
};

export default React.memo(Info);
