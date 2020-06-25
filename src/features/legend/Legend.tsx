import React from 'react';
import styles from './Legend.module.css';
import { useSelector } from 'react-redux';
import { selectPricesToColors } from './legendSlice';
import MoneyUtils from '../../utils/moneyUtils';

const Legend: React.FunctionComponent = () => {
  const pricesToColors = useSelector(selectPricesToColors);
  return (
    <div className={styles.legendContainer}>
      {Object.keys(pricesToColors).map((el, shadeIndex) => {
        const priceSubIntervalInfo = pricesToColors[shadeIndex];
        const nextPriceSubIntervalInfo = pricesToColors[shadeIndex + 1];
        return (
          <div key={shadeIndex}>
            <div style={{ backgroundColor: priceSubIntervalInfo.color }} />
            <span>
              {shadeIndex + 1}
              {' -'}
            </span>{' '}
            <span>{MoneyUtils.format(priceSubIntervalInfo.price) + ' - ' + (nextPriceSubIntervalInfo ? MoneyUtils.format(nextPriceSubIntervalInfo.price) : '...')}</span>{' '}
            <span>
              {' '}
              ({priceSubIntervalInfo.suburbCount} {priceSubIntervalInfo.suburbCount === 1 ? 'suburb' : 'suburbs'})
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(Legend);
