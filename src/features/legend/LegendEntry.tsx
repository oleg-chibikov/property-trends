import { LegendEntryEventHandlers } from '../../interfaces';
import MoneyUtils from '../../utils/moneyUtils';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './Legend.module.css';

interface LegendEntry {
  index: number;
  color: string;
  price: number;
  nextPrice?: number;
  suburbCount: number;
  isHighlighted: boolean;
}

interface LegendEntryProps extends LegendEntryEventHandlers, LegendEntry {}

const Legend: React.FunctionComponent<LegendEntryProps> = ({ onItemMouseOver, onItemMouseOut, index, color, price, nextPrice, suburbCount, isHighlighted }) => {
  return (
    <div className={isHighlighted ? styles.highlighted : ''} onMouseOver={() => onItemMouseOver(price)} onMouseOut={() => onItemMouseOut(price)}>
      <div style={{ backgroundColor: color }} />
      <span>
        {index + 1}
        {' -'}
      </span>{' '}
      <span>{MoneyUtils.format(price) + ' - ' + (nextPrice ? MoneyUtils.format(nextPrice) : '...')}</span>{' '}
      <span>
        {' '}
        ({suburbCount} {suburbCount === 1 ? 'suburb' : 'suburbs'})
      </span>
    </div>
  );
};

Legend.propTypes = {
  onItemMouseOver: PropTypes.func.isRequired,
  onItemMouseOut: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  nextPrice: PropTypes.number,
  suburbCount: PropTypes.number.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
};

export default React.memo(Legend);
