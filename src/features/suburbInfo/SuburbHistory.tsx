import React, { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fetchSuburbHistory from '../../backendRequests/suburbHistoryRetrieval';
import { MapFilters } from '../../interfaces';
import { selectFilters } from '../filters/filtersSlice';
import Spinner from '../spinner/Spinner';
import BrushChart from './BrushChart';
import { selectHistory, selectSuburbKey, setHistory } from './suburbInfoSlice';

let dispatch: Dispatch<any>;

const fetchAndApplyData = async (filters: MapFilters, state: string, postCode: number, locality: string) => {
  const data = await fetchSuburbHistory(filters, state, postCode, locality);
  dispatch(setHistory(data?.sort((a, b) => (a.date > b.date ? 1 : -1)) || []));
};

const SuburbHistory: React.FunctionComponent = () => {
  const history = useSelector(selectHistory);
  const filters = useSelector(selectFilters);
  const suburbKey = useSelector(selectSuburbKey);
  dispatch = useDispatch();

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
