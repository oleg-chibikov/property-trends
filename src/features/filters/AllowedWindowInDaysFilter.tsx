import { Tooltip } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import SliderFilter from './SliderFilter';
import { changeAllowedWindowInDays, selectAllowedWindowInDays } from './filtersSlice';

const Filters: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
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
