import React, { ChangeEvent } from 'react';
import { changePropertyType, selectPropertyType } from './filtersSlice';
import { useSelector, useDispatch } from 'react-redux';

const Filters: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const propertyType = useSelector(selectPropertyType);
  return (
    <div>
      Property type:{' '}
      <select value={propertyType} onChange={(event: ChangeEvent<HTMLSelectElement>) => dispatch(changePropertyType(event.target.value))}>
        <option value="apartment">Apartment/Unit</option>
        <option value="house">House</option>
      </select>
    </div>
  );
};

export default React.memo(Filters);
