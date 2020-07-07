import { Switch, Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import SliderFilter from './SliderFilter';

interface RangeFilterProps {
  isRangeByDefault?: boolean;
  label: string;
  value: number | number[];
  min: number;
  max: number;
  onChange: (value: number | number[]) => void;
}

const RangeFilter: React.FunctionComponent<RangeFilterProps> = ({ isRangeByDefault, label, value, onChange, min, max }) => {
  const [isRange, setIsRange] = useState<boolean>(isRangeByDefault || false);
  const marks: { value: number; label: string }[] = [];
  for (let i = min; i <= max; i++) {
    marks.push({ value: i, label: i.toString() + (i === max ? '+' : '') });
  }
  return (
    <SliderFilter
      min={min}
      max={max}
      onChange={onChange}
      value={value}
      convertValue={(value) => (isRange ? (Array.isArray(value) ? [...value] : [value, value]) : Array.isArray(value) ? value[0] : value)}
      marks={marks}
      label={
        <Tooltip title="Use range selection">
          <span>
            {label}: <Switch size="small" checked={isRange} onChange={() => setIsRange(!isRange)} />
          </span>
        </Tooltip>
      }
    />
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
