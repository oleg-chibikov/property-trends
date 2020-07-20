import React, { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fetchDistrictList from '../../backendRequests/districtListRetrieval';
import DistrictList from './DistrictList';
import { addDistrictFileNames, checkState, selectExpanded, selectRetrySwitch, setExpanded, toggleExpanded } from './districtListSlice';

let dispatch: Dispatch<any>;

const fetchAndApplyDistrictsList = async () => {
  const data = await fetchDistrictList();
  if (data) {
    dispatch(addDistrictFileNames(data));
    dispatch(checkState('NSW'));
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
