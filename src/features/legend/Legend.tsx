import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Accordion, AccordionDetails, AccordionSummary, useMediaQuery, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { priceDataSearchPromiseTrackerArea } from '../../backendRequests/priceDataSearch';
import { LegendEntryEventHandlers } from '../../interfaces';
import Spinner from '../spinner/Spinner';
import styles from './Legend.module.css';
import LegendEntry from './LegendEntry';
import { selectLegendPricesToColors } from './legendSlice';

const Legend: React.FunctionComponent<LegendEntryEventHandlers> = ({ onItemClick, onItemMouseOut }) => {
  const priceDataSearchPromiseTracker = usePromiseTracker({ area: priceDataSearchPromiseTrackerArea, delay: 0 });
  const pricesToColors = useSelector(selectLegendPricesToColors);
  const [expanded, setExpanded] = useState<boolean>();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    setExpanded(isDesktop);
  }, [setExpanded, isDesktop]);

  const toggle = useCallback(() => {
    setExpanded(!expanded);
  }, [setExpanded, expanded]);

  if (priceDataSearchPromiseTracker.promiseInProgress) {
    return <Spinner tooltip="Loading prices..." />;
  }
  const keys = Object.keys(pricesToColors).map(Number);
  if (!keys.length) {
    return <div className={styles.legendContainer}>No price data</div>;
  }
  return (
    <Accordion expanded={expanded} square onChange={toggle} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandLessIcon />}>Legend</AccordionSummary>
      <AccordionDetails>
        <div className={styles.legendContainer}>
          {keys.map((el, index) => {
            const currentPriceIntervalInfo = pricesToColors[el];
            const nextPriceIntervalInfo = pricesToColors[keys[index + 1]];
            if (!currentPriceIntervalInfo.suburbCount) {
              return null;
            }
            return (
              <LegendEntry
                key={index}
                color={currentPriceIntervalInfo.color}
                price={currentPriceIntervalInfo.intervalMinPrice}
                nextPrice={nextPriceIntervalInfo?.intervalMinPrice}
                suburbCount={currentPriceIntervalInfo.suburbCount}
                onItemClick={onItemClick}
                onItemMouseOut={onItemMouseOut}
              />
            );
          })}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default React.memo(Legend);
