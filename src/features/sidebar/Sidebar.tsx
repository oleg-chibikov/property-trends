import React from 'react';
import styles from './Sidebar.module.css';
import DistrictList from '../districtList/DistrictList';
import Filters from '../filters/Filters';

const Sidebar: React.FunctionComponent = () => (
  <div className={styles.sidebar}>
    <Filters />
    <DistrictList />
  </div>
);

export default React.memo(Sidebar);
