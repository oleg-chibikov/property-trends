import React, { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fetchSuburbHistory from '../../backendRequests/suburbHistoryRetrieval';
import { MapFilters } from '../../interfaces';
import { selectFilters } from '../filters/filtersSlice';
import Spinner from '../spinner/Spinner';
import SuburbHistoryChart from './SuburbHistoryChart';
import styles from './SuburbInfo.module.css';
import { selectHistory, selectSuburbKey, setHistory } from './suburbInfoSlice';

let dispatch: Dispatch<any>;

const fetchAndApplyData = async (filters: MapFilters, postCode: number, locality: string) => {
  const data = await fetchSuburbHistory(filters, postCode, locality);
  dispatch(setHistory(data?.sort((a, b) => (a.date > b.date ? 1 : -1)) || []));
};

const SuburbHistory: React.FunctionComponent = () => {
  const history = useSelector(selectHistory);
  const filters = useSelector(selectFilters);
  const suburbKey = useSelector(selectSuburbKey);
  dispatch = useDispatch();

  useEffect(() => {
    if (suburbKey) {
      fetchAndApplyData(filters, suburbKey.postCode, suburbKey.locality);
    }
  }, [filters, suburbKey]);

  if (!suburbKey) {
    return null;
  }

  if (!history) {
    return <Spinner tooltip="Loading history..."></Spinner>;
  }

  const lineData = history.map((el) => ({ x: el.date.split('T')[0], y: el.medianPrice as number | null, z: el.count }));
  const data = [
    // { id: 'very high weight', data: lineData.filter((el) => el.z >= 10) },
    // { id: 'high weight', data: lineData.filter((el) => el.z >= 5 && el.z < 10) },
    // { id: 'low weight', data: lineData.filter((el) => el.z < 5) },
    { id: filters.dealType, data: lineData },
  ];

  return (
    <div className={styles.historyGraph}>
      {/* {history.map((el, index) => (
        <div key={index}>{index + 1 + '. ' + el.date + MoneyUtils.format(el.medianPrice)}</div>
      ))} */}

      <SuburbHistoryChart data={data} />
    </div>
  );
};

export default React.memo(SuburbHistory);
