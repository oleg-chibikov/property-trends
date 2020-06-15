import React from 'react';
import { useSelector } from 'react-redux';
import { selectSuburbs } from './suburbsListControlSlice';
import styles from './SuburbsListControl.module.css';

interface SuburbsListControlState {
  suburbs: string[];
}

const SuburbsListControl: React.FunctionComponent = () => {
  const suburbs = useSelector(selectSuburbs);
  return (
    <div className={styles.suburbs}>
      {suburbs.map((value, i, elements) => {
        return (
          <div className={styles.suburb} key={i}>
            {value}
          </div>
        );
      })}
    </div>
  );
};

export default SuburbsListControl;
