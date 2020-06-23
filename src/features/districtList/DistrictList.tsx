import React from 'react';
import styles from './DistrictList.module.css';
import DistrictSelector from './DistrictSelector';

const districtString = process.env.GEO_FILES || '';
const districts = districtString.split('|');

const DistrictList: React.FunctionComponent = () => (
  <div className={styles.districtList}>
    {districts.map((key) => (
      <DistrictSelector key={key} checked={key.indexOf('NSW - Sydney - City and Inner South') !== -1} name={key} />
    ))}
  </div>
);

export default React.memo(DistrictList);
