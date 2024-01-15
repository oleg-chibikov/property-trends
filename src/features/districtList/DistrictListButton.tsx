import ErrorIcon from '@mui/icons-material/Error';
import MapIcon from '@mui/icons-material/Map';
import { IconButton, Typography } from '@mui/material';
import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { districtListRetrievalPromiseTrackerArea } from '../../backendRequests/districtListRetrieval';
import Spinner from '../spinner/Spinner';
import { processDistrictsPromiseTrackerArea } from '../suburbMap/SuburbMap';
import SelectedStates from './SelectedStates';
import { selectDistrictsByState, toggleDistrictListExpanded } from './districtListSlice';

const DistrictListButton: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const toggleDrawer = () => {
    dispatch(toggleDistrictListExpanded());
  };

  const districtListRetrievalPromiseTracker = usePromiseTracker({ area: districtListRetrievalPromiseTrackerArea, delay: 0 });
  const districtProcessingPromiseTracker = usePromiseTracker({ area: processDistrictsPromiseTrackerArea, delay: 0 });
  const districtsByState = useSelector(selectDistrictsByState);

  const renderButton = () => {
    if (districtListRetrievalPromiseTracker.promiseInProgress) {
      return <Spinner size={25} tooltip="Loading districts..." />;
    }
    if (districtProcessingPromiseTracker.promiseInProgress) {
      return <Spinner size={25} tooltip="Rendering district data..." />;
    }

    const keys = districtsByState ? Object.keys(districtsByState) : null;

    if (!keys?.length) {
      return <ErrorIcon color="primary" />;
    }
    return <MapIcon />;
  };

  return (
    <Typography component="div" variant="caption">
      {
        <IconButton title="Districts" onClick={toggleDrawer}>
          {renderButton()}
        </IconButton>
      }
      <SelectedStates />
    </Typography>
  );
};

export default React.memo(DistrictListButton);
