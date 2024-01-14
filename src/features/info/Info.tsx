import Apartment from '@mui/icons-material/Apartment';
import CloseIcon from '@mui/icons-material/Close';
import Home from '@mui/icons-material/Home';
import { Typography } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { InfoData } from '../../interfaces';
import MoneyUtils from '../../utils/moneyUtils';
import { selectFilters } from '../filters/filtersSlice';
import RealEstateSuburbLink from '../links/RealEstateSuburbLink';
import styles from './Info.module.css';
import { clearInfo, selectInfo } from './infoSlice';

const Info: React.FunctionComponent = () => {
  const info = useSelector(selectInfo);
  const filters = useSelector(selectFilters);
  const isApartment = filters.propertyType === 'apartment';
  const dispatch = useDispatch<AppDispatch>();

  const renderAdditionalInfo = (info: InfoData) =>
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
  if (!info) {
    return null;
  }
  return (
    <Typography variant="body2" component="div" className={styles.info}>
      <h4 className={styles.header}>
        <RealEstateSuburbLink {...info} />
        <CloseIcon
          onClick={() => {
            dispatch(clearInfo());
          }}
        />
      </h4>
      <div>
        {info.state} - {info.district}
      </div>
      {renderAdditionalInfo(info)}
    </Typography>
  );
};

export default React.memo(Info);
