import { Slider, Tooltip, Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeAllowedWindowInDays, selectAllowedWindowInDays } from './filtersSlice';

const Filters: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const allowedWindowInDays = useSelector(selectAllowedWindowInDays);
  return (
    <Tooltip title="Show only the data modified within this interval">
      <div>
        <Typography variant="body1">Data relevance:</Typography>
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
    </Tooltip>
  );
};

export default React.memo(Filters);
