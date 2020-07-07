import { FormControlLabel, useMediaQuery, useTheme } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import StringUtils from '../../utils/stringUtils';
import { checkDistrict, setExpanded, uncheckDistrict } from './districtListSlice';

interface IDistrictSelectorProps {
  name: string;
  checked: boolean;
}

const DistrictSelector: React.FunctionComponent<IDistrictSelectorProps> = ({ name, checked }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const onChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      dispatch(checkDistrict(name));
    } else {
      dispatch(uncheckDistrict(name));
    }
    if (!isDesktop) {
      dispatch(setExpanded(false));
    }
  };
  return (
    <div>
      <FormControlLabel control={<Checkbox checked={checked} onChange={onChange} />} label={StringUtils.removePostfix(name.substr(name.indexOf(' - ') + 3))} />
    </div>
  );
};

DistrictSelector.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
};

export default React.memo(DistrictSelector);
