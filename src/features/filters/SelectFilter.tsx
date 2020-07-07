import { FormControl, InputLabel, MenuItem, Select, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setExpanded } from './filtersSlice';

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
  const dispatch = useDispatch();
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
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(onChange(event.target.value as string));
            if (!isDesktop) {
              dispatch(setExpanded(false));
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

SelectFilter.propTypes = {
  data: PropTypes.any.isRequired,
  defaultValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default React.memo(SelectFilter);
