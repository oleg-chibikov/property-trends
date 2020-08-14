import React, { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fetchSuburbData from '../../backendRequests/suburbDataRetrieval';
import { MapFilters } from '../../interfaces';
import MoneyUtils from '../../utils/moneyUtils';
import { selectFilters } from '../filters/filtersSlice';
import RealEstatePropertyLink from '../links/RealEstatePropertyLink';
import Spinner from '../spinner/Spinner';
import styles from './SuburbInfo.module.css';
import { selectProperties, selectSuburbKey, setProperties } from './suburbInfoSlice';

let dispatch: Dispatch<any>;

const fetchAndApplyData = async (filters: MapFilters, state: string, postCode: number, locality: string) => {
  const data = await fetchSuburbData(filters, state, postCode, locality);
  dispatch(setProperties(data?.sort((a, b) => (a.minPrice > b.minPrice ? 1 : a.minPrice === b.minPrice ? ((a.maxPrice || 0) > (b.maxPrice || 0) ? 1 : -1) : -1)) || []));
};

const PropertiesList: React.FunctionComponent = () => {
  const properties = useSelector(selectProperties);
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

  if (!properties) {
    return <Spinner tooltip="Loading properties..."></Spinner>;
  }
  return (
    <div className={styles.propertiesList}>
      {properties.map((el, index) => (
        <div key={index}>
          {index + 1 + '. ' + MoneyUtils.format(el.minPrice) + (el.maxPrice ? ' - ' + MoneyUtils.format(el.maxPrice as number) : '') + ' '}
          <RealEstatePropertyLink id={el.id} text={el.address || 'No address'} />
        </div>
      ))}
    </div>
  );
};

export default React.memo(PropertiesList);
