import { FormControlLabel, Typography, useMediaQuery, useTheme } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import React, { Dispatch } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { checkState, selectCheckedStates, setDistrictListExpanded, uncheckState } from './districtListSlice';

let dispatch: Dispatch<unknown>;

interface StateEntryProps {
  state: string;
}

const StateEntryHeader: React.FunctionComponent<StateEntryProps> = ({ state }) => {
  dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const checkedStates = useSelector(selectCheckedStates);
  const checkedDistrictsCount = checkedStates[state] || 0;
  const checked = checkedDistrictsCount > 0;
  return (
    <Typography variant="body1">
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={checked}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.checked) {
                dispatch(checkState(state));
              } else {
                dispatch(uncheckState(state));
              }
              if (!isDesktop) {
                dispatch(setDistrictListExpanded(false));
              }
            }}
          />
        }
        label={`${state} (${checkedDistrictsCount})`}
      />
    </Typography>
  );
};

export default React.memo(StateEntryHeader);
