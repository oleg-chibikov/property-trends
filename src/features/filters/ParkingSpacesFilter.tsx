import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import RangeFilter from './RangeFilter';
import { changeParkingSpaces, selectParkingSpaces } from './filtersSlice';

const ParkingSpacesFilter: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const parkingspaces = useSelector(selectParkingSpaces);
  return <RangeFilter isRangeByDefault={true} label="Parking spaces" value={parkingspaces} min={0} max={7} onChange={(value) => dispatch(changeParkingSpaces(value))}></RangeFilter>;
};

export default React.memo(ParkingSpacesFilter);
