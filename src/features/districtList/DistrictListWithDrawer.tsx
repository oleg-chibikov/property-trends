import React, { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fetchDistrictList from '../../backendRequests/districtListRetrieval';
import DistrictList from './DistrictList';
import { addDistrictFileNames, checkInitialStateIfEmpty, selectDistrictListExpanded, selectDistrictListRetrySwitch, setDistrictListExpanded, setZoomToSelection, toggleDistrictListExpanded } from './districtListSlice';

let dispatch: Dispatch<any>;

const fetchAndApplyDistrictList = async () => {
  // In order to zoom to initial regions zoomToSelection should be explicitly set to true at startup (otherwise it might be overwritten by redux-persisted state)
  dispatch(setZoomToSelection(true));
  const data = await fetchDistrictList();
  if (data) {
    dispatch(addDistrictFileNames(data));
    dispatch(checkInitialStateIfEmpty('NSW'));
  }
};

const DistrictListWithDrawer: React.FunctionComponent = () => {
  const retrySwitch = useSelector(selectDistrictListRetrySwitch);
  useEffect(() => {
    fetchAndApplyDistrictList();
  }, [retrySwitch]);
  dispatch = useDispatch();
  return <DistrictList widthOrHeight={'20rem'} caption="Districts" anchor="right" selectExpanded={selectDistrictListExpanded} setExpanded={setDistrictListExpanded} toggleExpanded={toggleDistrictListExpanded} />;
};

export default React.memo(DistrictListWithDrawer);
