import { Button, Typography } from '@material-ui/core';
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
    <div>
      <Typography component="div" variant="caption">
        <Button onClick={toggleDrawer}>Districts</Button>
        <SelectedStates />
      </Typography>
    </div>
  );
};

export default React.memo(DistrictListButton);
