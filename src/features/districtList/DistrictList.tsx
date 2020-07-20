import { FormGroup, IconButton } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import React, { useEffect } from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { useDispatch, useSelector } from 'react-redux';
import { districtListRetrievalPromiseTrackerArea } from '../../backendRequests/districtListRetrieval';
import withDrawer from '../../hoc/WithDrawer';
import { processDistrictsPromiseTrackerArea } from '../realEstateMap/SuburbMap';
import Spinner from '../spinner/Spinner';
import { selectDistrictsByState, selectElementToScrollTo, toggleRetry } from './districtListSlice';
import StateEntry from './StateEntry';

const scrollToSuburb = (elementIdToScrollTo: string | undefined) => {
  if (elementIdToScrollTo) {
    const scrollIntoView = () => {
      const el = document.querySelector('#' + elementIdToScrollTo);
      if (el) {
        el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' });
      }
    };
    setTimeout(scrollIntoView, 100);
  }
};

const DistrictList: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const districtsByState = useSelector(selectDistrictsByState);
  const districtListRetrievalPromiseTracker = usePromiseTracker({ area: districtListRetrievalPromiseTrackerArea, delay: 0 });
  const districtProcessingPromiseTracker = usePromiseTracker({ area: processDistrictsPromiseTrackerArea, delay: 0 });
  const elementToScrollTo = useSelector(selectElementToScrollTo);
  useEffect(() => {
    scrollToSuburb(elementToScrollTo);
  });

  if (districtListRetrievalPromiseTracker.promiseInProgress) {
    return <Spinner size={25} tooltip="Loading districts..." />;
  }
  if (districtProcessingPromiseTracker.promiseInProgress) {
    return <Spinner size={25} tooltip="Rendering district data..." />;
  }

  const keys = districtsByState ? Object.keys(districtsByState) : null;

  if (!keys?.length) {
    return (
      <React.Fragment>
        <IconButton
          onClick={() => {
            dispatch(toggleRetry());
          }}
          title="Retry"
        >
          <ErrorIcon color="secondary" />
        </IconButton>{' '}
        Error fetching districts. Please retry.
      </React.Fragment>
    );
  }

  return (
    <FormGroup>
      {keys.map((state, index) => (
        <StateEntry key={index} state={state} />
      ))}
    </FormGroup>
  );
};

export default React.memo(withDrawer(DistrictList));
