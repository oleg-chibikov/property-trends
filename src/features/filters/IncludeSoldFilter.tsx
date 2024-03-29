import { Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { changeIncludeSold, selectDealType, selectIncludeSold } from './filtersSlice';

const IncludeSoldFilter: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  let defaultValue = useSelector(selectIncludeSold);
  const dealType = useSelector(selectDealType);
  const isRent = dealType === 'rent';
  if (isRent) {
    defaultValue = false;
  }
  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            disabled={isRent}
            checked={defaultValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              dispatch(changeIncludeSold(event.target.checked));
            }}
            color="primary"
          />
        }
        label="Include sold properties"
      />
    </div>
  );
};

export default React.memo(IncludeSoldFilter);
