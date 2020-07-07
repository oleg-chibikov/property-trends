import React from 'react';
import DistrictList from './DistrictList';
import { selectExpanded, setExpanded, toggleExpanded } from './districtListSlice';

const DistrictListWithDrawer: React.FunctionComponent = () => {
  return <DistrictList caption="Districts" anchor="right" selectExpanded={selectExpanded} setExpanded={setExpanded} toggleExpanded={toggleExpanded} />;
};

export default React.memo(DistrictListWithDrawer);
