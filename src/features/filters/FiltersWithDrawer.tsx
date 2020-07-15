import React from 'react';
import FiltersList from './FiltersList';
import { selectExpanded, setExpanded, toggleExpanded } from './filtersSlice';

const FiltersWithDrawer: React.FunctionComponent = () => {
  return <FiltersList widthOrHeight={'15rem'} caption="Filters" anchor="left" selectExpanded={selectExpanded} setExpanded={setExpanded} toggleExpanded={toggleExpanded} />;
};

export default React.memo(FiltersWithDrawer);
