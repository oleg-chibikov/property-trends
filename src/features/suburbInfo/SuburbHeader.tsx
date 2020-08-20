import React from 'react';
import { useSelector } from 'react-redux';
import RealEstateSuburbLink from '../links/RealEstateSuburbLink';
import styles from './SuburbInfo.module.css';
import { selectSuburbInfoSuburbKey } from './suburbInfoSlice';

const SuburbHeader: React.FunctionComponent = () => {
  const suburbKey = useSelector(selectSuburbInfoSuburbKey);

  if (!suburbKey) {
    return null;
  }

  return (
    <h4 className={styles.header}>
      <RealEstateSuburbLink {...suburbKey} />
    </h4>
  );
};

export default React.memo(SuburbHeader);
