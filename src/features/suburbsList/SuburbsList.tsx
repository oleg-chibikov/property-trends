import React from 'react';
import { useSelector } from 'react-redux';
import { selectSuburbs } from './suburbsListSlice';
import styles from './SuburbsList.module.css';

interface SuburbsListState {
  suburbs: string[];
}

const SuburbsList: React.FunctionComponent = () => {
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

export default SuburbsList;
