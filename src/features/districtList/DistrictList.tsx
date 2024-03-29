import ErrorIcon from '@mui/icons-material/Error';
import { FormGroup, IconButton } from '@mui/material';
import React, { useEffect } from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { districtListRetrievalPromiseTrackerArea } from '../../backendRequests/districtListRetrieval';
import withDrawer from '../../hoc/WithDrawer';
import Spinner from '../spinner/Spinner';
import { processDistrictsPromiseTrackerArea } from '../suburbMap/SuburbMap';
import AdaptiveColorsSwitch from './AdaptiveColorsSwitch';
import StateEntry from './StateEntry';
import { selectDistrictsByState, selectElementToScrollTo, toggleDistrictListRetry } from './districtListSlice';

const scrollToSuburb = (elementIdToScrollTo: string | undefined) => {
  if (elementIdToScrollTo) {
    const scrollIntoView = () => {
      const el = document.querySelector('#' + elementIdToScrollTo);
      if (el) {
        el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' });
      }
    };
    scrollIntoView();
    setTimeout(scrollIntoView, 500);
  }
};

const DistrictList: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const districtsByState = useSelector(selectDistrictsByState);
  const districtListRetrievalPromiseTracker = usePromiseTracker({ area: districtListRetrievalPromiseTrackerArea, delay: 0 });
  const districtProcessingPromiseTracker = usePromiseTracker({ area: processDistrictsPromiseTrackerArea, delay: 0 });
  const elementToScrollTo = useSelector(selectElementToScrollTo);
  useEffect(() => {
    scrollToSuburb(elementToScrollTo);
  });

  if (districtListRetrievalPromiseTracker.promiseInProgress) {
    return <Spinner tooltip="Loading districts..." />;
  }
  if (districtProcessingPromiseTracker.promiseInProgress) {
    return <Spinner tooltip="Rendering district data..." />;
  }

  const keys = districtsByState ? Object.keys(districtsByState) : null;

  if (!keys?.length) {
    return (
      <React.Fragment>
        <IconButton
          onClick={() => {
            dispatch(toggleDistrictListRetry());
          }}
          title="Retry"
        >
          <ErrorIcon color="primary" />
        </IconButton>{' '}
        Error fetching districts. Please retry.
      </React.Fragment>
    );
  }

  return (
    <FormGroup>
      <AdaptiveColorsSwitch />
      {keys.map((state, index) => (
        <StateEntry key={index} state={state} />
      ))}
    </FormGroup>
  );
};

export default React.memo(withDrawer(DistrictList));
