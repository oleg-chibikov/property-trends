import React, { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import fetchSuburbHistory from '../../backendRequests/suburbHistoryRetrieval';
import { MapFilters } from '../../interfaces';
import { selectFilters } from '../filters/filtersSlice';
import Spinner from '../spinner/Spinner';
import BrushChart from './BrushChart';
import { selectSuburbInfoHistory, selectSuburbInfoSuburbKey, setSuburbInfoHistory } from './suburbInfoSlice';

let dispatch: Dispatch<unknown>;

const fetchAndApplyData = async (filters: MapFilters, state: string, postCode: number, locality: string) => {
  // Always include sold data for history
  const data = await fetchSuburbHistory({ ...filters, includeSold: true }, state, postCode, locality);
  dispatch(setSuburbInfoHistory(data?.sort((a, b) => (a.date > b.date ? 1 : -1)) || []));
};

const SuburbHistory: React.FunctionComponent = () => {
  const history = useSelector(selectSuburbInfoHistory);
  const filters = useSelector(selectFilters);
  const suburbKey = useSelector(selectSuburbInfoSuburbKey);
  dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (suburbKey) {
      fetchAndApplyData(filters, suburbKey.state, suburbKey.postCode, suburbKey.locality);
    }
  }, [filters, suburbKey]);

  if (!suburbKey) {
    return null;
  }

  if (!history) {
    return <Spinner tooltip="Loading history..."></Spinner>;
  }

  const historyWithDates = history
    .filter((x) => x.medianPrice != null)
    .map((x) => ({
      date: new Date(x.date),
      median: x.medianPrice,
      count: x.count,
      min: x.minPrice,
      max: x.maxPrice,
    }));

  return <BrushChart data={historyWithDates} />;
};

export default React.memo(SuburbHistory);
