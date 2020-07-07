import { Mark, Slider, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setExpanded } from './filtersSlice';

interface SliderFilterProps {
  label: string | any;
  value: number | number[];
  min: number;
  max: number;
  marks: boolean | Mark[];
  onChange: (value: number | number[]) => void;
}

const SliderFilter: React.FunctionComponent<SliderFilterProps> = ({ marks, label, value, onChange, min, max }) => {
  const dispatch = useDispatch();
  const [localValue, setLocalValue] = useState<number | number[]>(value);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  return (
    <div>
      <Typography variant="body1">{label}</Typography>
      <div className="slider">
        <Slider
          min={min}
          max={max}
          value={localValue}
          valueLabelDisplay="auto"
          marks={marks}
          onChange={(event: unknown, newValue: number | number[]) => {
            setLocalValue(newValue);
          }}
          onChangeCommitted={(event: unknown, newValue: number | number[]) => {
            onChange(newValue);
            if (!isDesktop) {
              dispatch(setExpanded(false));
            }
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
};

export default React.memo(SliderFilter);
