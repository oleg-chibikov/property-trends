import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { FeatureEntryEventHandlers, WithMap } from '../../interfaces';
import FeatureEntry from './FeatureEntry';
import styles from './FeatureList.module.css';
import { selectFeatures } from './featureListSlice';

interface FeatureListProps extends FeatureEntryEventHandlers, WithMap {}

const FeatureList: React.FunctionComponent<FeatureListProps> = (props) => {
  const features = useSelector(selectFeatures);
  return (
    <div onMouseOver={() => props.leafletMap.scrollWheelZoom.disable()} onMouseOut={() => props.leafletMap.scrollWheelZoom.enable()} className={styles.features}>
      {Object.keys(features)
        .sort()
        .map((key) => {
          return <FeatureEntry key={features[key].suburbId} {...{ ...features[key], ...props }} />;
        })}
    </div>
  );
};

FeatureList.propTypes = {
  onItemMouseOver: PropTypes.func.isRequired,
  onItemMouseOut: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
  leafletMap: PropTypes.any.isRequired,
};

export default React.memo(FeatureList);
