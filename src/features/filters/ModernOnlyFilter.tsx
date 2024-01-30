import { Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { changeModernOnly, selectModernOnly } from './filtersSlice';

const ModernOnlyFilter: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const defaultValue = useSelector(selectModernOnly);
  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={defaultValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              dispatch(changeModernOnly(event.target.checked));
            }}
            color="primary"
          />
        }
        label="Show only modern properties"
      />
    </div>
  );
};

export default React.memo(ModernOnlyFilter);
