import React from 'react';
import { useSelector } from 'react-redux';
import { changePropertyType, selectPropertyType } from './filtersSlice';
import SelectFilter from './SelectFilter';

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
