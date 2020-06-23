import React from 'react';
import styles from './Legend.module.css';
import { useSelector } from 'react-redux';
import { selectPricesToColors } from './legendSlice';
import MoneyUtils from '../../utils/moneyUtils';

const Legend: React.FunctionComponent = () => {
  const pricesToColors = useSelector(selectPricesToColors);
  return (
    <div className={styles.legendContainer}>
      {Object.keys(pricesToColors)
        .map(Number)
        .map((key, index, elements) => {
          return (
            <div key={key}>
              <div style={{ backgroundColor: pricesToColors[key] }} />
              <span>{MoneyUtils.format(elements[index]) + ' - ' + (elements[index + 1] ? MoneyUtils.format(elements[index + 1]) : '...')}</span>
            </div>
          );
        })}
    </div>
  );
};

export default React.memo(Legend);
