import React, { useEffect } from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { polygonRetrievalPromiseTrackerArea } from '../../backendRequests/polygonRetrieval';
import { SuburbListEntryEventHandlers, WithMap } from '../../interfaces';
import SearchBoxButton from '../search/SearchBoxButton';
import Spinner from '../spinner/Spinner';
import styles from './SuburbList.module.css';
import SuburbListEntry from './SuburbListEntry';
import { selectScrollToSuburbInList, selectSuburbsInList } from './suburbListSlice';

interface FeatureListProps extends SuburbListEntryEventHandlers, WithMap {}

const SuburbList: React.FunctionComponent<FeatureListProps> = (props) => {
  const polygonRetrievalPromiseTracker = usePromiseTracker({ area: polygonRetrievalPromiseTrackerArea, delay: 0 });
  const suburbs = useSelector(selectSuburbsInList);
  const scrollToSuburb = useSelector(selectScrollToSuburbInList);
  useEffect(() => {
    if (scrollToSuburb) {
      const scrollIntoView = () => {
        const el = document.querySelector('#suburb' + scrollToSuburb);
        if (el) {
          el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' });
        }
      };
      scrollIntoView();
    }
  }, [scrollToSuburb]);
  if (polygonRetrievalPromiseTracker.promiseInProgress) {
    return <Spinner tooltip="Loading polygons..." />;
  }
  return (
    <div className={styles.suburbListWrapper}>
      <SearchBoxButton />
      <div onMouseOver={() => props.leafletMap.scrollWheelZoom.disable()} onMouseOut={() => props.leafletMap.scrollWheelZoom.enable()} className={styles.suburbList}>
        {Object.keys(suburbs)
          .sort()
          .map((key) => {
            return <SuburbListEntry key={suburbs[key].suburbId} {...{ ...suburbs[key], ...props }} />;
          })}
      </div>
    </div>
  );
};

export default React.memo(SuburbList);
