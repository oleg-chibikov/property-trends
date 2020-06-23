import React, { ChangeEvent } from 'react';
import { changeConstructionStatus, selectConstructionStatus } from './filtersSlice';
import { useSelector, useDispatch } from 'react-redux';

const Filters: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const constructionStatus = useSelector(selectConstructionStatus);
  return (
    <div>
      Construction status:{' '}
      <select
        value={constructionStatus}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
          dispatch(changeConstructionStatus(event.target.value));
        }}
      >
        <option value="">Any</option>
        <option value="new">New</option>
        <option value="established">Established</option>
      </select>
    </div>
  );
};

export default React.memo(Filters);
