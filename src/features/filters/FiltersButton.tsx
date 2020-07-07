import { Button, Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleExpanded } from './filtersSlice';
import SelectedFilters from './SelectedFilters';

const Filters: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    dispatch(toggleExpanded());
  };

  return (
    <div>
      <Typography component="div" variant="caption">
        <Button onClick={toggleDrawer}>Filters</Button>
        <SelectedFilters />
      </Typography>
    </div>
  );
};

export default React.memo(Filters);
