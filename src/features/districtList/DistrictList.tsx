import { FormGroup } from '@material-ui/core';
import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { districtListRetrievalPromiseTrackerArea } from '../../backendRequests/districtListRetrieval';
import withDrawer from '../../hoc/WithDrawer';
import Spinner from '../spinner/Spinner';
import { selectDistrictsByState } from './districtListSlice';
import StateEntry from './StateEntry';

const DistrictList: React.FunctionComponent = () => {
  const districtsByState = useSelector(selectDistrictsByState);
  const districtListRetrievalPromiseTracker = usePromiseTracker({ area: districtListRetrievalPromiseTrackerArea, delay: 0 });
  if (districtListRetrievalPromiseTracker.promiseInProgress) {
    return <Spinner tooltip="Loading districts..." />;
  }
  console.log('DistrictList');

  return (
    <FormGroup>
      {Object.keys(districtsByState).map((state, index) => (
        <StateEntry key={index} state={state} />
      ))}
    </FormGroup>
  );
};

export default React.memo(withDrawer(DistrictList));
