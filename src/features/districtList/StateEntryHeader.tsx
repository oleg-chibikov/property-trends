import { FormControlLabel, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import React, { Dispatch } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkState, selectCheckedStates, setExpanded, uncheckState } from './districtListSlice';

let dispatch: Dispatch<unknown>;

interface StateEntryProps {
  state: string;
}

const StateEntryHeader: React.FunctionComponent<StateEntryProps> = ({ state }) => {
  dispatch = useDispatch();
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
            checked={checked}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.checked) {
                dispatch(checkState(state));
              } else {
                dispatch(uncheckState(state));
              }
              if (!isDesktop) {
                dispatch(setExpanded(false));
              }
            }}
          />
        }
        label={`${state} (${checkedDistrictsCount})`}
      />
    </Typography>
  );
};

StateEntryHeader.propTypes = {
  state: PropTypes.string.isRequired,
};

export default React.memo(StateEntryHeader);
