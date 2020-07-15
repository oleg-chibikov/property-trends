import { IconButton, Typography } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleExpanded } from './filtersSlice';
import SelectedFilters from './SelectedFilters';

const FiltersButton: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    dispatch(toggleExpanded());
  };

  return (
    <Typography component="div" variant="caption">
      {
        <IconButton title="Filters" onClick={toggleDrawer}>
          <TuneIcon />
        </IconButton>
      }
      <SelectedFilters />
    </Typography>
  );
};

export default React.memo(FiltersButton);
