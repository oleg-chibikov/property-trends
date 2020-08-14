import { Switch, Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import SliderFilter from './SliderFilter';

interface RangeFilterProps {
  isRangeByDefault?: boolean;
  label: string;
  value: number | number[];
  min: number;
  max: number;
  onChange: (value: number | number[]) => void;
}

const RangeFilter: React.FunctionComponent<RangeFilterProps> = ({ label, value, onChange, min, max }) => {
  let isRange = Array.isArray(value);
  const marks: { value: number; label: string }[] = [];
  for (let i = min; i <= max; i++) {
    marks.push({ value: i, label: i.toString() + (i === max ? '+' : '') });
  }
  const convertValue = (value: number | number[]) => {
    return isRange ? (Array.isArray(value) ? [...value] : [value, value]) : Array.isArray(value) ? value[0] : value;
  };
  return (
    <SliderFilter
      min={min}
      max={max}
      onChange={onChange}
      value={value}
      convertValue={convertValue}
      marks={marks}
      label={
        <Tooltip title="Use range selection">
          <span>
            {label}:{' '}
            <Switch
              color="primary"
              size="small"
              checked={isRange}
              onChange={() => {
                isRange = !isRange;
                onChange(convertValue(value));
              }}
            />
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
