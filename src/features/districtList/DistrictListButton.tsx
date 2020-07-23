import { IconButton, Typography } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import MapIcon from '@material-ui/icons/Map';
import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { useDispatch, useSelector } from 'react-redux';
import { districtListRetrievalPromiseTrackerArea } from '../../backendRequests/districtListRetrieval';
import { processDistrictsPromiseTrackerArea } from '../realEstateMap/SuburbMap';
import Spinner from '../spinner/Spinner';
import { selectDistrictsByState, toggleExpanded } from './districtListSlice';
import SelectedStates from './SelectedStates';

const DistrictListButton: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    dispatch(toggleExpanded());
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
