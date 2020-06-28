import React from 'react';
import { changeParkingSpaces, selectParkingSpaces } from './filtersSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RangeSlider } from 'rsuite';
import { ValueType } from 'rsuite/lib/RangeSlider';

const Filters: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const parkingSpaces = useSelector(selectParkingSpaces);
  return (
    <div>
      Parking spaces:{' '}
      <RangeSlider
        min={0}
        max={7}
        defaultValue={parkingSpaces}
        onChange={(value: ValueType) => {
          dispatch(changeParkingSpaces(value));
        }}
      />
    </div>
  );
};

export default React.memo(Filters);
