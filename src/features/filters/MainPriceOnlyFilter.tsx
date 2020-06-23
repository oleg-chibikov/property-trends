import React, { ChangeEvent } from 'react';
import { changeMainPriceOnly, selectMainPriceOnly } from './filtersSlice';
import { useSelector, useDispatch } from 'react-redux';

const Filters: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const mainPriceOnly = useSelector(selectMainPriceOnly);
  return (
    <div>
      <input
        type="checkbox"
        checked={mainPriceOnly}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          dispatch(changeMainPriceOnly(event.target.checked));
        }}
      />{' '}
      Include only dealer prices
    </div>
  );
};

export default React.memo(Filters);
