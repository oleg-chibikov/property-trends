import PropTypes from 'prop-types';
import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { priceDataSearchPromiseTrackerArea } from '../../backendRequests/priceDataSearch';
import { LegendEntryEventHandlers } from '../../interfaces';
import Spinner from '../spinner/Spinner';
import styles from './Legend.module.css';
import LegendEntry from './LegendEntry';
import { selectPricesToColors } from './legendSlice';

const Legend: React.FunctionComponent<LegendEntryEventHandlers> = ({ onItemMouseOver, onItemMouseOut }) => {
  const priceDataSearchPromiseTracker = usePromiseTracker({ area: priceDataSearchPromiseTrackerArea, delay: 0 });
  const pricesToColors = useSelector(selectPricesToColors);
  if (priceDataSearchPromiseTracker.promiseInProgress) {
    return <Spinner />;
  }
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
