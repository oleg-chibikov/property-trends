import DistrictList from '../districtList/DistrictList';
import Filters from '../filters/Filters';
import React from 'react';
import SearchBox from '../search/SearchBox';
import styles from './Sidebar.module.css';

const Sidebar: React.FunctionComponent = () => (
  <div className={styles.sidebar}>
    <SearchBox />
    <Filters />
    <DistrictList />
  </div>
);

export default React.memo(Sidebar);
