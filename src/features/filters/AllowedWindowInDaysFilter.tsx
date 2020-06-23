import React from 'react';
import { changeAllowedWindowInDays, selectAllowedWindowInDays } from './filtersSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Slider } from 'rsuite';

const Filters: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const allowedWindowInDays = useSelector(selectAllowedWindowInDays);
  return (
    <div>
      Allowed price window (days):{' '}
      <Slider
        min={1}
        max={365}
        defaultValue={allowedWindowInDays}
        onChange={(value: number) => {
          dispatch(changeAllowedWindowInDays(value));
        }}
      />
    </div>
  );
};

export default React.memo(Filters);
