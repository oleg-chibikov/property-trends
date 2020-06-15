import React from 'react';
import styles from './LegendControl.module.css';
import Control from 'react-leaflet-control';

interface LegendControlProps {
  colorsDictionary: { [needle: number]: string };
}

const LegendControl: React.FunctionComponent<LegendControlProps> = ({
  colorsDictionary,
}) => (
  <Control position="bottomright">
    <div className={styles.Legend}>
      {Object.keys(colorsDictionary)
        .map(Number)
        .map((value, i, elements) => {
          return (
            <div className={styles.legend} key={value}>
              <div style={{ backgroundColor: colorsDictionary[value] }} />
              <span>{elements[i] + ' - ' + (elements[i + 1] || '...')}</span>
            </div>
          );
        })}
    </div>
  </Control>
);

export default LegendControl;
