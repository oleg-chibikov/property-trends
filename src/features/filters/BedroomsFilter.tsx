import React from 'react';
import { changeBedrooms, selectBedrooms } from './filtersSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RangeSlider } from 'rsuite';
import { ValueType } from 'rsuite/lib/RangeSlider';

const Filters: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const bedrooms = useSelector(selectBedrooms);
  return (
    <div>
      Bedrooms:{' '}
      <RangeSlider
        min={1}
        max={7}
        defaultValue={bedrooms}
        onChange={(value: ValueType) => {
          dispatch(changeBedrooms(value));
        }}
      />
    </div>
  );
};

export default React.memo(Filters);
