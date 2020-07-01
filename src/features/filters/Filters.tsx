import AllowedWindowInDaysFilter from './AllowedWindowInDaysFilter';
import BathroomsFilter from './BathroomsFilter';
import BedroomsFilter from './BedroomsFilter';
import ConstructionStatusFilter from './ConstructionStatusFilter';
import DealTypesFilter from './DealTypesFilter';
import MainPriceOnlyFilter from './MainPriceOnlyFilter';
import ParkingSpacesFilter from './ParkingSpacesFilter';
import PropertyTypesFilter from './PropertyTypesFilter';
import React from 'react';
import style from './Filters.module.css';

const Filters: React.FunctionComponent = () => {
  return (
    <div className={style.filters}>
      <PropertyTypesFilter />
      <DealTypesFilter />
      <ConstructionStatusFilter />
      <BedroomsFilter />
      <BathroomsFilter />
      <ParkingSpacesFilter />
      <AllowedWindowInDaysFilter />
      <MainPriceOnlyFilter />
    </div>
  );
};

export default React.memo(Filters);
