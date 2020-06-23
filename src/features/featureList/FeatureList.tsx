import React from 'react';
import { useSelector } from 'react-redux';
import { selectFeatures } from './featureListSlice';
import styles from './FeatureList.module.css';
import FeatureEntry from './FeatureEntry';
import PropTypes from 'prop-types';
import { FeatureHandlers } from '../../interfaces';

const FeatureList: React.FunctionComponent<FeatureHandlers> = (props) => {
  const features = useSelector(selectFeatures);
  return (
    <div className={styles.features}>
      {Object.keys(features).map((key) => {
        return <FeatureEntry key={features[key].id} {...{ ...features[key], ...props }} />;
      })}
    </div>
  );
};

FeatureList.propTypes = {
  onFeatureEntryMouseOver: PropTypes.func.isRequired,
  onFeatureEntryMouseOut: PropTypes.func.isRequired,
  onFeatureEntryClick: PropTypes.func.isRequired,
};

export default React.memo(FeatureList);
