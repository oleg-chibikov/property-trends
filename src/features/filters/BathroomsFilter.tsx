import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { changeBathrooms, selectBathrooms } from './filtersSlice';
import RangeFilter from './RangeFilter';

const BathroomsFilter: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const bathrooms = useSelector(selectBathrooms);
  return <RangeFilter label="Bathrooms" value={bathrooms} min={0} max={7} onChange={(value) => dispatch(changeBathrooms(value))}></RangeFilter>;
};

export default React.memo(BathroomsFilter);
