import { Mark, Slider, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

interface SliderFilterProps {
  label: string | any;
  value: number | number[];
  min: number;
  max: number;
  marks: boolean | Mark[];
  onChange: (value: number | number[]) => void;
  convertValue?: (value: number | number[]) => number | number[] | undefined;
}

const SliderFilter: React.FunctionComponent<SliderFilterProps> = ({ convertValue, marks, label, value, onChange, min, max }) => {
  const isRange = Array.isArray(value);
  const [localValue, setLocalValue] = useState<number | number[]>(value);
  const valueCopy = convertValue ? convertValue(localValue) : localValue;
  return (
    <div>
      <Typography variant="body1">{label}</Typography>
      <div className="slider">
        <Slider
          track={!isRange ? false : 'normal'}
          min={min}
          max={max}
          value={valueCopy}
          valueLabelDisplay="auto"
          marks={marks}
          onChange={(event: unknown, newValue: number | number[]) => {
            setLocalValue(newValue);
          }}
          onChangeCommitted={(event: unknown, newValue: number | number[]) => {
            onChange(newValue);
          }}
        />
      </div>
    </div>
  );
};

SliderFilter.propTypes = {
  label: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  marks: PropTypes.any.isRequired,
  convertValue: PropTypes.func,
};

export default React.memo(SliderFilter);
