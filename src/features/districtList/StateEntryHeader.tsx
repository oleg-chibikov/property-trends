import { FormControlLabel } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import React, { Dispatch } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkState, selectCheckedStates, uncheckState } from './districtListSlice';

let dispatch: Dispatch<unknown>;

interface StateEntryProps {
  state: string;
}

const StateEntryHeader: React.FunctionComponent<StateEntryProps> = ({ state }) => {
  dispatch = useDispatch();

  const checkedStates = useSelector(selectCheckedStates);
  const checkedDistrictsCount = checkedStates[state] || 0;
  const checked = checkedDistrictsCount > 0;
  return (
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
          }}
        />
      }
      label={`${state} (${checkedDistrictsCount})`}
    />
  );
};

StateEntryHeader.propTypes = {
  state: PropTypes.string.isRequired,
};

export default React.memo(StateEntryHeader);
