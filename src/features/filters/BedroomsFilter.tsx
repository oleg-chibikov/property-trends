import React from 'react';
import { changeBedrooms, selectBedrooms } from './filtersSlice';
import { useSelector, useDispatch } from 'react-redux';
import RangeFilter from './RangeFilter';

const BedroomsFilter: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const bedrooms = useSelector(selectBedrooms);
  return <RangeFilter label="Bedrooms" value={bedrooms} min={1} max={7} onChange={(value) => dispatch(changeBedrooms(value))}></RangeFilter>;
};

export default React.memo(BedroomsFilter);
