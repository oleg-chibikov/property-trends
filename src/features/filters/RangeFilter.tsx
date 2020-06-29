import React, { useState } from 'react';
import { RangeSlider, Slider } from 'rsuite';
import { ValueType } from 'rsuite/lib/RangeSlider';
import PropTypes from 'prop-types';

interface RangeFilterProps {
  isRangeByDefault?: boolean;
  label: string;
  value: ValueType;
  min: number;
  max: number;
  onChange: (value: ValueType) => void;
}

const RangeFilter: React.FunctionComponent<RangeFilterProps> = ({ isRangeByDefault, label, value, onChange, min, max }) => {
  const [isRange, setIsRange] = useState<boolean>(isRangeByDefault || false);
  return (
    <div>
      {label}: <input type="checkbox" checked={isRangeByDefault} onClick={() => setIsRange(!isRange)} /> Range{' '}
      {isRange ? (
        <RangeSlider min={min} max={max} defaultValue={value} onChange={onChange} />
      ) : (
        <Slider
          min={1}
          max={7}
          defaultValue={value[0]}
          onChange={(value: number) => {
            onChange([value, value]);
          }}
        />
      )}
    </div>
  );
};

RangeFilter.propTypes = {
  isRangeByDefault: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default React.memo(RangeFilter);
