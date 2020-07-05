import { Slider, Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeAllowedWindowInDays, selectAllowedWindowInDays } from './filtersSlice';

const Filters: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const allowedWindowInDays = useSelector(selectAllowedWindowInDays);
  return (
    <div>
      <Typography variant="body1">Allowed price window (days):</Typography>
      <div className="slider">
        <Slider
          min={1}
          max={365}
          value={allowedWindowInDays}
          valueLabelDisplay="auto"
          marks={[
            {
              value: 1,
              label: '1d',
            },
            {
              value: 365,
              label: '1y',
            },
          ]}
          onChange={(event: unknown, newValue: number | number[]) => {
            dispatch(changeAllowedWindowInDays(newValue as number));
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(Filters);
