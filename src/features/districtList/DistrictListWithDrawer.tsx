import React, { Dispatch, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import fetchDistrictList from '../../backendRequests/districtListRetrieval';
import DistrictList from './DistrictList';
import { addDistrictFileNames, checkState, selectExpanded, setExpanded, toggleExpanded } from './districtListSlice';

let dispatch: Dispatch<any>;
const fetchAndApplyDistrictsList = async () => {
  const districtList = await fetchDistrictList();
  dispatch(addDistrictFileNames(districtList));
  dispatch(checkState('NSW'));
};

const DistrictListWithDrawer: React.FunctionComponent = () => {
  useEffect(() => {
    fetchAndApplyDistrictsList();
  }, []);
  dispatch = useDispatch();
  return <DistrictList widthOrHeight={'20rem'} caption="Districts" anchor="right" selectExpanded={selectExpanded} setExpanded={setExpanded} toggleExpanded={toggleExpanded} />;
};

export default React.memo(DistrictListWithDrawer);
