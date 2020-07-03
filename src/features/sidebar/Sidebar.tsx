import React from 'react';
import DistrictList from '../districtList/DistrictList';
import Filters from '../filters/Filters';
import styles from './Sidebar.module.css';

const Sidebar: React.FunctionComponent = () => (
  <div className={styles.sidebar}>
    <Filters />
    <DistrictList />
  </div>
);

export default React.memo(Sidebar);
