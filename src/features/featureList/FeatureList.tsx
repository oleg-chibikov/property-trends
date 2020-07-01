import { FeatureEntryEventHandlers } from '../../interfaces';
import { selectFeatures } from './featureListSlice';
import { useSelector } from 'react-redux';
import FeatureEntry from './FeatureEntry';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './FeatureList.module.css';

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
