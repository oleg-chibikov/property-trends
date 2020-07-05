import { Slider, Switch, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

interface RangeFilterProps {
  isRangeByDefault?: boolean;
  label: string;
  value: number | number[];
  min: number;
  max: number;
  onChange: (value: number | number[]) => void;
}

const RangeFilter: React.FunctionComponent<RangeFilterProps> = ({ isRangeByDefault, label, value, onChange, min, max }) => {
  const marks: { value: number; label: string }[] = [];

  for (let i = min; i <= max; i++) {
    marks.push({ value: i, label: i.toString() + (i === max ? '+' : '') });
  }

  const [isRange, setIsRange] = useState<boolean>(isRangeByDefault || false);
  const valueCopy = isRange ? (Array.isArray(value) ? [...value] : [value, value]) : Array.isArray(value) ? value[0] : value;
  return (
    <div>
      <Typography variant="body1">
        {label}: <Switch size="small" checked={isRange} onChange={() => setIsRange(!isRange)} />
      </Typography>
      <div className="slider">
        <Slider
          min={min}
          max={max}
          value={valueCopy}
          valueLabelDisplay="auto"
          marks={marks}
          onChange={(event: unknown, newValue: number | number[]) => {
            onChange(newValue);
          }}
        />
      </div>
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
