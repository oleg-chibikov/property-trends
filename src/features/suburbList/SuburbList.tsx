import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { polygonRetrievalPromiseTrackerArea } from '../../backendRequests/polygonRetrieval';
import { SuburbListEntryEventHandlers, WithMap } from '../../interfaces';
import Spinner from '../spinner/Spinner';
import styles from './SuburbList.module.css';
import SuburbListEntry from './SuburbListEntry';
import { selectScrollToSuburb, selectSuburbs } from './suburbListSlice';

interface FeatureListProps extends SuburbListEntryEventHandlers, WithMap {}

const SuburbList: React.FunctionComponent<FeatureListProps> = (props) => {
  const polygonRetrievalPromiseTracker = usePromiseTracker({ area: polygonRetrievalPromiseTrackerArea, delay: 0 });
  const features = useSelector(selectSuburbs);
  const scrollToSuburb = useSelector(selectScrollToSuburb);
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
    return <Spinner />;
  }
  return (
    <div onMouseOver={() => props.leafletMap.scrollWheelZoom.disable()} onMouseOut={() => props.leafletMap.scrollWheelZoom.enable()} className={styles.suburbList}>
      {Object.keys(features)
        .sort()
        .map((key) => {
          return <SuburbListEntry key={features[key].suburbId} {...{ ...features[key], ...props }} />;
        })}
    </div>
  );
};

SuburbList.propTypes = {
  onItemMouseOver: PropTypes.func.isRequired,
  onItemMouseOut: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
  leafletMap: PropTypes.any.isRequired,
};

export default React.memo(SuburbList);
