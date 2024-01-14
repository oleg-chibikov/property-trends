import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Typography } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { toggleSearchBoxExpanded } from './searchBoxSlice';

const SearchBoxButton: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const toggleDrawer = () => {
    dispatch(toggleSearchBoxExpanded());
  };

  return (
    <Typography component="div" variant="caption">
      {
        <IconButton title="Search" onClick={toggleDrawer}>
          <SearchIcon color="primary" />
        </IconButton>
      }
    </Typography>
  );
};

export default React.memo(SearchBoxButton);
