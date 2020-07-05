import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { LegendEntryEventHandlers } from '../../interfaces';
import MoneyUtils from '../../utils/moneyUtils';
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

const Legend: React.FunctionComponent<LegendEntryProps> = ({ onItemClick: onItemMouseOver, onItemMouseOut, index, color, price, nextPrice, suburbCount, isHighlighted }) => {
  return (
    <div className={isHighlighted ? styles.highlighted : ''} onClick={() => onItemMouseOver(price)} onMouseOut={() => onItemMouseOut(price)}>
      <div style={{ backgroundColor: color }} />
      <Typography variant="body2" component="span">
        {index + 1} - {MoneyUtils.format(price)} - {nextPrice ? MoneyUtils.format(nextPrice) : '...'} ({suburbCount})
      </Typography>
    </div>
  );
};

Legend.propTypes = {
  onItemClick: PropTypes.func.isRequired,
  onItemMouseOut: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  nextPrice: PropTypes.number,
  suburbCount: PropTypes.number.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
};

export default React.memo(Legend);
