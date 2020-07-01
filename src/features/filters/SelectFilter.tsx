import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';

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

  return (
    <div>
      <FormControl variant="outlined">
        <InputLabel shrink>{name}</InputLabel>
        <Select
          label={name}
          displayEmpty
          value={defaultValue}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            dispatch(onChange(event.target.value as string));
          }}
        >
          {data.map((el) => (
            <MenuItem key={el.value} value={el.value}>
              {el.label}
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
