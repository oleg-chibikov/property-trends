import { Checkbox, FormControlLabel, useMediaQuery, useTheme } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeMainPriceOnly, selectMainPriceOnly, setExpanded } from './filtersSlice';

const MainPriceOnlyFilter: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const defaultValue = useSelector(selectMainPriceOnly);
  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={defaultValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              dispatch(changeMainPriceOnly(event.target.checked));
              if (!isDesktop) {
                dispatch(setExpanded(false));
              }
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
