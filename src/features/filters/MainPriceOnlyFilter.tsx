import { Checkbox, FormControlLabel } from '@material-ui/core';
import { changeMainPriceOnly, selectMainPriceOnly } from './filtersSlice';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';

const MainPriceOnlyFilter: React.FunctionComponent = () => {
  const dispatch = useDispatch();
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
