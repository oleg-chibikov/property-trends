import React from 'react';
import SuburbInfo from './SuburbInfo';
import { selectSuburbInfoExpanded, setSuburbInfoExpanded, toggleSuburbInfoExpanded } from './suburbInfoSlice';

const SuburbInfoWithDrawer: React.FunctionComponent = () => {
  return <SuburbInfo openWhenDesktop={false} caption="SuburbInfo" anchor="bottom" selectExpanded={selectSuburbInfoExpanded} setExpanded={setSuburbInfoExpanded} toggleExpanded={toggleSuburbInfoExpanded} />;
};

export default React.memo(SuburbInfoWithDrawer);
