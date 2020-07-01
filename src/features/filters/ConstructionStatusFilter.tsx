import { changeConstructionStatus, selectConstructionStatus } from './filtersSlice';
import { useSelector } from 'react-redux';
import React from 'react';
import SelectFilter from './SelectFilter';

const ConstructionStatusFilter: React.FunctionComponent = () => {
  const defaultValue = useSelector(selectConstructionStatus);
  const data = [
    { label: 'Any', value: 'any' },
    { label: 'New', value: 'new' },
    { label: 'Established', value: 'established' },
  ];
  return <SelectFilter defaultValue={defaultValue} name="Status" data={data} onChange={changeConstructionStatus} />;
};

export default React.memo(ConstructionStatusFilter);
