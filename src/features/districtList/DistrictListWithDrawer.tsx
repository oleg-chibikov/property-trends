import React, { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fetchDistrictList from '../../backendRequests/districtListRetrieval';
import DistrictList from './DistrictList';
import { addDistrictFileNames, checkInitialStateIfEmpty, selectExpanded, selectRetrySwitch, setExpanded, setZoomToSelection, toggleExpanded } from './districtListSlice';

let dispatch: Dispatch<any>;

const fetchAndApplyDistrictsList = async () => {
  // In order to zoom to initial regions zoomToSelection should be explicitly set to true at startup (otherwise it might be overwritten by redux-persisted state)
  dispatch(setZoomToSelection(true));
  const data = await fetchDistrictList();
  if (data) {
    dispatch(addDistrictFileNames(data));
    dispatch(checkInitialStateIfEmpty('NSW'));
  }
};

const DistrictListWithDrawer: React.FunctionComponent = () => {
  const retrySwitch = useSelector(selectRetrySwitch);
  useEffect(() => {
    fetchAndApplyDistrictsList();
  }, [retrySwitch]);
  dispatch = useDispatch();
  return <DistrictList widthOrHeight={'20rem'} caption="Districts" anchor="right" selectExpanded={selectExpanded} setExpanded={setExpanded} toggleExpanded={toggleExpanded} />;
};

export default React.memo(DistrictListWithDrawer);
