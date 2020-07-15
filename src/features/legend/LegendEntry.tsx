import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { LegendEntryEventHandlers } from '../../interfaces';
import MoneyUtils from '../../utils/moneyUtils';
import styles from './Legend.module.css';
import { selectHighlightedPrices } from './legendSlice';

interface LegendEntry {
  color: string;
  price: number;
  nextPrice?: number;
  suburbCount: number;
}

interface LegendEntryProps extends LegendEntryEventHandlers, LegendEntry {}

const LegendEntry: React.FunctionComponent<LegendEntryProps> = ({ onItemClick: onItemMouseOver, onItemMouseOut, color, price, nextPrice, suburbCount }) => {
  const highlightedPrices = useSelector(selectHighlightedPrices);
  return (
    <div className={price in highlightedPrices ? styles.highlighted : undefined} onClick={() => onItemMouseOver(price)} onMouseOut={() => onItemMouseOut(price)}>
      <div style={{ backgroundColor: color }} />
      <Typography variant="subtitle1" component="span">
        {MoneyUtils.format(price)} - {nextPrice ? MoneyUtils.format(nextPrice) : '...'} ({suburbCount})
      </Typography>
    </div>
  );
};

LegendEntry.propTypes = {
  onItemClick: PropTypes.func.isRequired,
  onItemMouseOut: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  nextPrice: PropTypes.number,
  suburbCount: PropTypes.number.isRequired,
};

export default React.memo(LegendEntry);
