import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { FeatureEntryEventHandlers, WithMap } from '../../interfaces';
import styles from './SuburbList.module.css';
import SuburbListEntry from './SuburbListEntry';
import { selectFeatures } from './suburbListSlice';

interface FeatureListProps extends FeatureEntryEventHandlers, WithMap {}

const SuburbList: React.FunctionComponent<FeatureListProps> = (props) => {
  const features = useSelector(selectFeatures);
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
