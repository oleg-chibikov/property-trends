import { changePropertyType, selectPropertyType } from './filtersSlice';
import { useSelector } from 'react-redux';
import React from 'react';
import SelectFilter from './SelectFilter';

const PropertyTypesFilter: React.FunctionComponent = () => {
  const defaultValue = useSelector(selectPropertyType);

  const data = [
    { label: 'Apartment/Unit', value: 'apartment' },
    { label: 'House', value: 'house' },
  ];
  return <SelectFilter defaultValue={defaultValue} name="Property Type" data={data} onChange={changePropertyType} />;
};

export default React.memo(PropertyTypesFilter);
