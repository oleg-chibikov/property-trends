import { Tooltip } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import SliderFilter from './SliderFilter';
import { changeAllowedWindowInDays, selectAllowedWindowInDays } from './filtersSlice';

const marks = [
  {
    scaledValue: 1,
    label: '1d',
  },
  {
    scaledValue: 2,
    label: '2d',
  },
  {
    scaledValue: 3,
    label: '3d',
  },
  {
    scaledValue: 7,
    label: '1w',
  },
  {
    scaledValue: 14,
    label: '2w',
  },
  {
    scaledValue: 30,
    label: '1m',
  },
  {
    scaledValue: 180,
    label: '6m',
  },
  {
    scaledValue: 365,
    label: '1y',
  },
  {
    scaledValue: 500,
    label: 'any',
  },
].map((x, i) => ({ ...x, value: i }));

const reverseMarks = marks.reduce((result, item) => {
  result[item.scaledValue] = item.value;
  return result;
}, {});

const Filters: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const allowedWindowInDays = useSelector(selectAllowedWindowInDays);
  const value = reverseMarks[allowedWindowInDays];

  return (
    <SliderFilter
      min={0}
      max={marks.length - 1}
      value={value}
      label={
        <Tooltip title="Show only the data modified within this interval">
          <span>Data relevance:</span>
        </Tooltip>
      }
      marks={marks}
      onChange={(newValue: number | number[]) => {
        const scaledValue = marks[newValue as number].scaledValue;
        dispatch(changeAllowedWindowInDays(scaledValue));
      }}
    />
  );
};

export default React.memo(Filters);
