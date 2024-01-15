import React from 'react';
import { useSelector } from 'react-redux';
import SelectFilter from './SelectFilter';
import { changePropertyType, selectPropertyType } from './filtersSlice';

const PropertyTypesFilter: React.FunctionComponent = () => {
  const defaultValue = useSelector(selectPropertyType);

  const data = [
    { label: 'Apartment/Unit', value: 'apartment' },
    { label: 'House', value: 'house' },
    { label: 'Townhouse', value: 'townhouse' },
    { label: 'Land', value: 'land' },
    { label: 'Retirement living', value: 'retire' },
    { label: 'Other', value: 'none' },
  ];
  return <SelectFilter defaultValue={defaultValue} name="Property Type" data={data} onChange={changePropertyType} />;
};

export default React.memo(PropertyTypesFilter);
