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
  const marks: { value: number; label: string }[] = [];
  for (let i = min; i <= max; i++) {
    marks.push({ value: i, label: i.toString() + (i === max ? '+' : '') });
  }
  return <SliderFilter label={label} min={min} max={max} onChange={onChange} value={value} marks={marks} useRange={true} />;
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
