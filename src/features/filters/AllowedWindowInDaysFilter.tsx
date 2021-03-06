import { Tooltip } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeAllowedWindowInDays, selectAllowedWindowInDays } from './filtersSlice';
import SliderFilter from './SliderFilter';

const Filters: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const allowedWindowInDays = useSelector(selectAllowedWindowInDays);
  return (
    <SliderFilter
      min={1}
      max={60}
      value={allowedWindowInDays}
      label={
        <Tooltip title="Show only the data modified within this interval">
          <span>Data relevance:</span>
        </Tooltip>
      }
      marks={[
        {
          value: 1,
          label: '1d',
        },
        {
          value: 30,
          label: '1m',
        },
        {
          value: 60,
          label: '2m',
        },
      ]}
      onChange={(newValue: number | number[]) => {
        dispatch(changeAllowedWindowInDays(newValue as number));
      }}
    />
  );
};

export default React.memo(Filters);
