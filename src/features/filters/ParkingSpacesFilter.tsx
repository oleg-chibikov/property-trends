import { changeParkingSpaces, selectParkingSpaces } from './filtersSlice';
import { useDispatch, useSelector } from 'react-redux';
import RangeFilter from './RangeFilter';
import React from 'react';

const ParkingSpacesFilter: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const parkingspaces = useSelector(selectParkingSpaces);
  return <RangeFilter isRangeByDefault={true} label="Parking spaces" value={parkingspaces} min={0} max={7} onChange={(value) => dispatch(changeParkingSpaces(value))}></RangeFilter>;
};

export default React.memo(ParkingSpacesFilter);
