import React from 'react';
import { changeBathrooms, selectBathrooms } from './filtersSlice';
import { useSelector, useDispatch } from 'react-redux';
import RangeFilter from './RangeFilter';

const BathroomsFilter: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const bathrooms = useSelector(selectBathrooms);
  return <RangeFilter isRangeByDefault={true} label="Bathrooms" value={bathrooms} min={0} max={7} onChange={(value) => dispatch(changeBathrooms(value))}></RangeFilter>;
};

export default React.memo(BathroomsFilter);
