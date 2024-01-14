import TuneIcon from '@mui/icons-material/Tune';
import { IconButton, Typography } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { toggleFiltersExpanded } from './filtersSlice';
import SelectedFilters from './SelectedFilters';

const FiltersButton: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const toggleDrawer = () => {
    dispatch(toggleFiltersExpanded());
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
