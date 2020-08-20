import React from 'react';
import SearchBox from './SearchBox';
import { selectSearchBoxExpanded, setSearchBoxExpanded, toggleSearchBoxExpanded } from './searchBoxSlice';

const SearchBoxWithDrawer: React.FunctionComponent = () => {
  return <SearchBox openWhenDesktop={false} caption="SearchBox" anchor="top" selectExpanded={selectSearchBoxExpanded} setExpanded={setSearchBoxExpanded} toggleExpanded={toggleSearchBoxExpanded} />;
};

export default React.memo(SearchBoxWithDrawer);
