import React from 'react';
import { changeBathrooms, selectBathrooms } from './filtersSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RangeSlider } from 'rsuite';
import { ValueType } from 'rsuite/lib/RangeSlider';

const Filters: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const bathrooms = useSelector(selectBathrooms);
  return (
    <div>
      Bathrooms:{' '}
      <RangeSlider
        min={1}
        max={7}
        defaultValue={bathrooms}
        onChange={(value: ValueType) => {
          dispatch(changeBathrooms(value));
        }}
      />
    </div>
  );
};

export default React.memo(Filters);
