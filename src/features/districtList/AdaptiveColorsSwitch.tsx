import { Checkbox, FormControlLabel, Tooltip } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUseAdaptiveColors, toggleUseAdaptiveColors } from './districtListSlice';

const MainPriceOnlyFilter: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const defaultValue = useSelector(selectUseAdaptiveColors);
  return (
    <div>
      <Tooltip title="When cheched the color range will be applied to the selected districts only, otherwise to the whole possible range">
        <FormControlLabel
          control={
            <Checkbox
              checked={defaultValue}
              onChange={() => {
                dispatch(toggleUseAdaptiveColors());
              }}
              color="primary"
            />
          }
          label="Use adaptive colors"
        />
      </Tooltip>
    </div>
  );
};

export default React.memo(MainPriceOnlyFilter);
