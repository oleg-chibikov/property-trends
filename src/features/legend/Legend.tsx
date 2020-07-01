import { LegendEntryEventHandlers } from '../../interfaces';
import { selectPricesToColors } from './legendSlice';
import { useSelector } from 'react-redux';
import LegendEntry from './LegendEntry';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './Legend.module.css';

const Legend: React.FunctionComponent<LegendEntryEventHandlers> = ({ onItemMouseOver, onItemMouseOut }) => {
  const pricesToColors = useSelector(selectPricesToColors);
  const keys = Object.keys(pricesToColors).map(Number);
  return (
    <div className={styles.legendContainer}>
      {keys.map((el, index) => {
        const currentPriceIntervalInfo = pricesToColors[el];
        const nextPriceIntervalInfo = pricesToColors[keys[index + 1]];
        return (
          <LegendEntry
            key={index}
            color={currentPriceIntervalInfo.color}
            price={currentPriceIntervalInfo.intervalMinPrice}
            nextPrice={nextPriceIntervalInfo?.intervalMinPrice}
            suburbCount={currentPriceIntervalInfo.suburbCount}
            isHighlighted={currentPriceIntervalInfo.isHighlighted || false}
            index={index}
            onItemMouseOver={onItemMouseOver}
            onItemMouseOut={onItemMouseOut}
          />
        );
      })}
    </div>
  );
};

Legend.propTypes = {
  onItemMouseOver: PropTypes.func.isRequired,
  onItemMouseOut: PropTypes.func.isRequired,
};

export default React.memo(Legend);
