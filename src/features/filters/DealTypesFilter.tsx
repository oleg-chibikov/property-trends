import React, { ChangeEvent } from 'react';
import { changeDealType, selectDealType } from './filtersSlice';
import { useSelector, useDispatch } from 'react-redux';

const DealTypesFilter: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const dealType = useSelector(selectDealType);
  return (
    <div>
      Deal type:{' '}
      <select value={dealType} onChange={(event: ChangeEvent<HTMLSelectElement>) => dispatch(changeDealType(event.target.value))}>
        <option value="buy">Buy</option>
        <option value="rent">Rent</option>
      </select>
    </div>
  );
};

export default React.memo(DealTypesFilter);
