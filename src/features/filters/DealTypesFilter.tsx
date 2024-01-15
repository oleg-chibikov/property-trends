import React from 'react';
import { useSelector } from 'react-redux';
import SelectFilter from './SelectFilter';
import { changeDealType, selectDealType } from './filtersSlice';

const DealTypesFilter: React.FunctionComponent = () => {
  const defaultValue = useSelector(selectDealType);

  const data = [
    { label: 'Buy', value: 'buy' },
    { label: 'Rent', value: 'rent' },
  ];
  return <SelectFilter defaultValue={defaultValue} name="Deal Type" data={data} onChange={changeDealType} />;
};

export default React.memo(DealTypesFilter);
