import { Grid, Slider, Switch } from '@material-ui/core';
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
  const [isRange, setIsRange] = useState<boolean>(isRangeByDefault || false);
  return (
    <div>
      {label}:{' '}
      <Grid component="label" container alignItems="center" spacing={1}>
        <Grid item>Off</Grid>
        <Grid item>
          <Switch checked={isRange} onChange={() => setIsRange(!isRange)} />
        </Grid>
        <Grid item>On</Grid>
      </Grid>
      <Slider
        min={min}
        max={max}
        defaultValue={value}
        valueLabelDisplay="auto"
        onChange={(event: unknown, newValue: number | number[]) => {
          //  onChange(newValue);
        }}
      />
      )
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
