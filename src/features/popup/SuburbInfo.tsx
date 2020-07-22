import React from 'react';
import { useSelector } from 'react-redux';
import MoneyUtils from '../../utils/moneyUtils';
import Spinner from '../spinner/Spinner';
import styles from './Popup.module.css';
import { selectProperties } from './popupSlice';
import RealEstatePropertyLink from './RealEstatePropertyLink';

const SuburbInfo: React.FunctionComponent = () => {
  const properties = useSelector(selectProperties);
  if (!properties) {
    return <Spinner tooltip="Loading suburb info"></Spinner>;
  }
  return (
    <div className={styles.propertiesList}>
      {properties.map((property, index) => (
        <div key={index}>
          {index + 1 + '. ' + MoneyUtils.format(property.minPrice) + (property.maxPrice ? ' - ' + MoneyUtils.format(property.maxPrice as number) : '') + ' '}
          <RealEstatePropertyLink id={property.id} text={property.address || 'No address'} />
        </div>
      ))}
    </div>
  );
};

export default React.memo(SuburbInfo);
