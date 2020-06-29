import React from 'react';
import { useSelector } from 'react-redux';
import { selectFeatures } from './featureListSlice';
import styles from './FeatureList.module.css';
import FeatureEntry from './FeatureEntry';
import PropTypes from 'prop-types';
import { FeatureEntryEventHandlers } from '../../interfaces';

const FeatureList: React.FunctionComponent<FeatureEntryEventHandlers> = (props) => {
  const features = useSelector(selectFeatures);
  return (
    <div className={styles.features}>
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
};

export default React.memo(FeatureList);
