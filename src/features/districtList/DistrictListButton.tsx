import { IconButton, Typography } from '@material-ui/core';
import MapIcon from '@material-ui/icons/Map';
import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleExpanded } from './districtListSlice';
import SelectedStates from './SelectedStates';

const DistrictListButton: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    dispatch(toggleExpanded());
  };

  return (
    <Typography component="div" variant="caption">
      {
        <IconButton title="Districts" onClick={toggleDrawer}>
          <MapIcon />
        </IconButton>
      }
      <SelectedStates />
    </Typography>
  );
};

export default React.memo(DistrictListButton);
