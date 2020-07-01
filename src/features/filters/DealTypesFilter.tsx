import { changeDealType, selectDealType } from './filtersSlice';
import { useSelector } from 'react-redux';
import React from 'react';
import SelectFilter from './SelectFilter';

const DealTypesFilter: React.FunctionComponent = () => {
  const defaultValue = useSelector(selectDealType);

  const data = [
    { label: 'Buy', value: 'buy' },
    { label: 'Rent', value: 'rent' },
  ];
  return <SelectFilter defaultValue={defaultValue} name="Deal Type" data={data} onChange={changeDealType} />;
};

export default React.memo(DealTypesFilter);
