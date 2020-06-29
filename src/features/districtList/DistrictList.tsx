import React from 'react';
import styles from './DistrictList.module.css';
import DistrictSelector from './DistrictSelector';

const districtString = process.env.GEO_FILES || '';
const districts = districtString.split('|');
const districtsByState: { [state: string]: string[] } = {};
for (const district of districts) {
  const state = district.substr(0, district.indexOf(' - '));
  const districtsForState = districtsByState[state] || [];
  districtsForState.push(district);
  districtsByState[state] = districtsForState;
}

const renderDistrict = (district: string) => (
  <DistrictSelector
    key={district}
    checked={
      district.indexOf('NSW - Sydney - City and Inner South') !== -1 ||
      district.indexOf('NSW - Sydney - Eastern Suburbs') !== -1 ||
      district.indexOf('NSW - Sydney - Inner South West') !== -1 ||
      district.indexOf('NSW - Sydney - Inner West') !== -1
    }
    name={district}
  />
);

const renderState = (state: string) => {
  const districtsForState = districtsByState[state];
  return (
    <React.Fragment>
      <h4>{state}</h4>
      <div>{districtsForState.map(renderDistrict)}</div>
    </React.Fragment>
  );
};

const DistrictList: React.FunctionComponent = () => <div className={styles.districtList}>{Object.keys(districtsByState).map(renderState)}</div>;

export default React.memo(DistrictList);
