import React, { useState } from 'react';
import { changeBedrooms, selectBedrooms } from './filtersSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RangeSlider, Slider } from 'rsuite';
import { ValueType } from 'rsuite/lib/RangeSlider';

const Filters: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const bedrooms = useSelector(selectBedrooms);
  const [isRange, setIsRange] = useState<boolean>();
  return (
    <div>
      Bedrooms:{' '}
      {isRange ? (
        <RangeSlider
          min={1}
          max={7}
          defaultValue={bedrooms}
          onChange={(value: ValueType) => {
            dispatch(changeBedrooms(value));
          }}
        />
      ) : (
        <Slider
          min={1}
          max={7}
          defaultValue={bedrooms[0]}
          onChange={(value: number) => {
            dispatch(changeBedrooms([value, value]));
          }}
        />
      )}
      <span>
        <input type="checkbox" onClick={() => setIsRange(!isRange)} /> Range
      </span>
    </div>
  );
};

export default React.memo(Filters);
