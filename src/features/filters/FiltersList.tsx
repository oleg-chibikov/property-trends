import { FormGroup } from '@material-ui/core';
import React from 'react';
import withDrawer from '../../hoc/WithDrawer';
import AllowedWindowInDaysFilter from './AllowedWindowInDaysFilter';
import BathroomsFilter from './BathroomsFilter';
import BedroomsFilter from './BedroomsFilter';
import ConstructionStatusFilter from './ConstructionStatusFilter';
import DealTypesFilter from './DealTypesFilter';
import styles from './Filters.module.css';
import MainPriceOnlyFilter from './MainPriceOnlyFilter';
import ParkingSpacesFilter from './ParkingSpacesFilter';
import PropertyTypesFilter from './PropertyTypesFilter';

const FiltersList: React.FunctionComponent = () => {
  return (
    <FormGroup className={styles.filters}>
      <PropertyTypesFilter />
      <DealTypesFilter />
      <ConstructionStatusFilter />
      <BedroomsFilter />
      <BathroomsFilter />
      <ParkingSpacesFilter />
      <AllowedWindowInDaysFilter />
      <MainPriceOnlyFilter />
    </FormGroup>
  );
};

export default React.memo(withDrawer(FiltersList));
