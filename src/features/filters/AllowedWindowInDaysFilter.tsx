import { Slider } from '@material-ui/core';
import { changeAllowedWindowInDays, selectAllowedWindowInDays } from './filtersSlice';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';

const Filters: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const allowedWindowInDays = useSelector(selectAllowedWindowInDays);
  return (
    <div>
      Allowed price window (days):{' '}
      <Slider
        min={1}
        max={365}
        value={allowedWindowInDays}
        onChange={(event: unknown, newValue: number | number[]) => {
          dispatch(changeAllowedWindowInDays(newValue as number));
        }}
      />
    </div>
  );
};

export default React.memo(Filters);
