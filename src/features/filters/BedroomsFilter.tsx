import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import RangeFilter from './RangeFilter';
import { changeBedrooms, selectBedrooms } from './filtersSlice';

const BedroomsFilter: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const bedrooms = useSelector(selectBedrooms);
  return <RangeFilter label="Bedrooms" value={bedrooms} min={0} max={7} onChange={(value) => dispatch(changeBedrooms(value))}></RangeFilter>;
};

export default React.memo(BedroomsFilter);
