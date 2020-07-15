import { FormControlLabel, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import DomainUtils from '../../utils/domainUtils';
import { checkDistrict, setExpanded, uncheckDistrict } from './districtListSlice';

interface IDistrictSelectorProps {
  districtFileName: string;
  checked: boolean;
  id: string;
}

const DistrictSelector: React.FunctionComponent<IDistrictSelectorProps> = ({ districtFileName, checked, id }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      dispatch(checkDistrict(districtFileName));
    } else {
      dispatch(uncheckDistrict(districtFileName));
    }
    if (!isDesktop) {
      dispatch(setExpanded(false));
    }
  };
  return (
    <Typography variant="body2">
      <FormControlLabel control={<Checkbox id={id} checked={checked} onChange={onChange} />} label={DomainUtils.getDistrictNameFromFileName(districtFileName)} />
    </Typography>
  );
};

DistrictSelector.propTypes = {
  districtFileName: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
};

export default React.memo(DistrictSelector);
