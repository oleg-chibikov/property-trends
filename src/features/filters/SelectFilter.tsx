import { FormControl, InputLabel, MenuItem, Select, Typography, useMediaQuery, useTheme } from '@mui/material';
import { UnknownAction } from '@reduxjs/toolkit';
import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { setFiltersExpanded } from './filtersSlice';

interface SelectItem {
  label: string;
  value: string;
}

interface SelectFilterProps {
  data: SelectItem[];
  defaultValue: string;
  onChange: (value: string) => void;
  name: string;
}

const SelectFilter: React.FunctionComponent<SelectFilterProps> = ({ data, defaultValue, onChange, name }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <div>
      <FormControl variant="outlined">
        <InputLabel shrink>
          <Typography variant="body2">{name}</Typography>
        </InputLabel>
        <Select
          label={name}
          displayEmpty
          value={defaultValue}
          onChange={(event) => {
            dispatch(onChange(event.target.value as string) as unknown as UnknownAction);
            if (!isDesktop) {
              dispatch(setFiltersExpanded(false));
            }
          }}
        >
          {data.map((el) => (
            <MenuItem key={el.value} value={el.value}>
              <Typography variant="body1">{el.label}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default React.memo(SelectFilter);
