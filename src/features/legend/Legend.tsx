import React from 'react';
import styles from './Legend.module.css';

interface LegendProps {
  colorsDictionary: { [needle: number]: string };
}

const Legend: React.FunctionComponent<LegendProps> = ({ colorsDictionary }) => (
  <div className={styles.Legend}>
    {Object.keys(colorsDictionary)
      .map(Number)
      .map((key, index, elements) => {
        return (
          <div className={styles.legend} key={key}>
            <div style={{ backgroundColor: colorsDictionary[key] }} />
            <span>
              {elements[index] + ' - ' + (elements[index + 1] || '...')}
            </span>
          </div>
        );
      })}
  </div>
);

export default Legend;
