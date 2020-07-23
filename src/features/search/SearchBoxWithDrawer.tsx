import React from 'react';
import SearchBox from './SearchBox';
import { selectExpanded, setExpanded, toggleExpanded } from './searchBoxSlice';

const SearchBoxWithDrawer: React.FunctionComponent = () => {
  return <SearchBox openWhenDesktop={false} caption="SearchBox" anchor="top" selectExpanded={selectExpanded} setExpanded={setExpanded} toggleExpanded={toggleExpanded} />;
};

export default React.memo(SearchBoxWithDrawer);
