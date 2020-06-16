import React from 'react';
import { useSelector } from 'react-redux';
import { selectFeatures, FeatureHandlers } from './featureListSlice';
import styles from './FeatureList.module.css';
import FeatureEntry from './FeatureEntry';

interface FeatureListState {
  features: string[];
}

interface FeatureListProps extends FeatureHandlers {}

const FeatureList: React.FunctionComponent<FeatureListProps> = (props) => {
  const features = useSelector(selectFeatures);
  return (
    <div className={styles.features}>
      {Object.keys(features).map((key, index, elements) => {
        return (
          <FeatureEntry
            key={features[key].id}
            {...{ ...features[key], ...props }}
          />
        );
      })}
    </div>
  );
};

export default FeatureList;
