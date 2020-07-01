import { changeBathrooms, selectBathrooms } from './filtersSlice';
import { useDispatch, useSelector } from 'react-redux';
import RangeFilter from './RangeFilter';
import React from 'react';

const BathroomsFilter: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const bathrooms = useSelector(selectBathrooms);
  return <RangeFilter isRangeByDefault={true} label="Bathrooms" value={bathrooms} min={0} max={7} onChange={(value) => dispatch(changeBathrooms(value))}></RangeFilter>;
};

export default React.memo(BathroomsFilter);
