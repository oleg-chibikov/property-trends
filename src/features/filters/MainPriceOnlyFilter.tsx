import { Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { changeMainPriceOnly, selectMainPriceOnly } from './filtersSlice';

const MainPriceOnlyFilter: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const defaultValue = useSelector(selectMainPriceOnly);
  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={defaultValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              dispatch(changeMainPriceOnly(event.target.checked));
            }}
            color="primary"
          />
        }
        label="Include only dealer prices"
      />
    </div>
  );
};

export default React.memo(MainPriceOnlyFilter);
