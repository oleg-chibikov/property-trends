import React from 'react';
import FiltersList from './FiltersList';
import { selectFiltersExpanded, setFiltersExpanded, toggleFiltersExpanded } from './filtersSlice';

const FiltersWithDrawer: React.FunctionComponent = () => {
  return <FiltersList widthOrHeight={'15rem'} caption="Filters" anchor="left" selectExpanded={selectFiltersExpanded} setExpanded={setFiltersExpanded} toggleExpanded={toggleFiltersExpanded} />;
};

export default React.memo(FiltersWithDrawer);
