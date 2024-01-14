import { Typography } from '@mui/material';
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

export default React.memo(LegendEntry);
