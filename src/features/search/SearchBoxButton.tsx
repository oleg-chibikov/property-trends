import { IconButton, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleExpanded } from './searchBoxSlice';

const SearchBoxButton: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    dispatch(toggleExpanded());
  };

  return (
    <Typography component="div" variant="caption">
      {
        <IconButton title="Search" onClick={toggleDrawer}>
          <SearchIcon color="secondary" />
        </IconButton>
      }
    </Typography>
  );
};

export default React.memo(SearchBoxButton);