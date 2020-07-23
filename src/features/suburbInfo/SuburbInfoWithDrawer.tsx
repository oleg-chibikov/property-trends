import React from 'react';
import SuburbInfo from './SuburbInfo';
import { selectExpanded, setExpanded, toggleExpanded } from './suburbInfoSlice';

const SuburbInfoWithDrawer: React.FunctionComponent = () => {
  return <SuburbInfo openWhenDesktop={false} caption="SuburbInfo" anchor="bottom" selectExpanded={selectExpanded} setExpanded={setExpanded} toggleExpanded={toggleExpanded} />;
};

export default React.memo(SuburbInfoWithDrawer);
