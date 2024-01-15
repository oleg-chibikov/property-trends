import React from 'react';
import { useSelector } from 'react-redux';
import SelectFilter from './SelectFilter';
import { changeConstructionStatus, selectConstructionStatus } from './filtersSlice';

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
