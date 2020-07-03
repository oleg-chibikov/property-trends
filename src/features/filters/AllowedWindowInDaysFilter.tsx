import { Slider } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeAllowedWindowInDays, selectAllowedWindowInDays } from './filtersSlice';

const Filters: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const allowedWindowInDays = useSelector(selectAllowedWindowInDays);
  return (
    <div>
      Allowed price window (days):
      <div className="slider">
        <Slider
          min={1}
          max={365}
          value={allowedWindowInDays}
          onChange={(event: unknown, newValue: number | number[]) => {
            dispatch(changeAllowedWindowInDays(newValue as number));
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(Filters);
