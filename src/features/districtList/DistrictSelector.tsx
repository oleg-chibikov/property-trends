import { Checkbox, FormControlLabel, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import DomainUtils from '../../utils/domainUtils';
import { checkDistrict, setDistrictListExpanded, uncheckDistrict } from './districtListSlice';

interface IDistrictSelectorProps {
  districtFileName: string;
  checked: boolean;
  id: string;
}

const DistrictSelector: React.FunctionComponent<IDistrictSelectorProps> = ({ districtFileName, checked, id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      dispatch(checkDistrict(districtFileName));
    } else {
      dispatch(uncheckDistrict(districtFileName));
    }
    if (!isDesktop) {
      dispatch(setDistrictListExpanded(false));
    }
  };
  return (
    <Typography variant="caption">
      <FormControlLabel control={<Checkbox id={id} checked={checked} onChange={onChange} />} label={DomainUtils.getDistrictNameFromFileName(districtFileName)} />
    </Typography>
  );
};

export default React.memo(DistrictSelector);
