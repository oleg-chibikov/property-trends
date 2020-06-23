import React from 'react';
import style from './Filters.module.css';
import PropertyTypesFilter from './PropertyTypesFilter';
import DealTypesFilter from './DealTypesFilter';
import BedroomsFilter from './BedroomsFilter';
import BathroomsFilter from './BathroomsFilter';
import ParkingSpacesFilter from './ParkingSpacesFilter';
import AllowedWindowInDaysFilter from './AllowedWindowInDaysFilter';
import ConstructionStatusFilter from './ConstructionStatusFilter';
import MainPriceOnlyFilter from './MainPriceOnlyFilter';

const Filters: React.FunctionComponent = () => {
  return (
    <div className={style.filters}>
      <PropertyTypesFilter />
      <DealTypesFilter />
      <BedroomsFilter />
      <BathroomsFilter />
      <ParkingSpacesFilter />
      <AllowedWindowInDaysFilter />
      <ConstructionStatusFilter />
      <MainPriceOnlyFilter />
    </div>
  );
};

export default React.memo(Filters);
