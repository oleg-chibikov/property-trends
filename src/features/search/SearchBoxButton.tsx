import { IconButton, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleSearchBoxExpanded } from './searchBoxSlice';

const SearchBoxButton: React.FunctionComponent = () => {
  const dispatch = useDispatch();

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
