import { FormControlLabel } from '@material-ui/core';
import { checkDistrict, uncheckDistrict } from './districtListSlice';
import { useDispatch } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import React from 'react';
import StringUtils from '../../utils/stringUtils';

interface IDistrictSelectorProps {
  name: string;
  checked: boolean;
}

const DistrictSelector: React.FunctionComponent<IDistrictSelectorProps> = ({ name, checked }) => {
  const dispatch = useDispatch();
  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.checked) {
                dispatch(checkDistrict(name));
              } else {
                dispatch(uncheckDistrict(name));
              }
            }}
          />
        }
        label={StringUtils.removePostfix(name.substr(name.indexOf(' - ') + 3))}
      />
    </div>
  );
};

DistrictSelector.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
};

export default React.memo(DistrictSelector);
