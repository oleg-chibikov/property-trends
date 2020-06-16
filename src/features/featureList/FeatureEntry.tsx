import React, { useMemo } from 'react';
import styles from './FeatureList.module.css';
import { FeatureHandlers, FeatureInfo } from './featureListSlice';

interface FeatureEntryProps extends FeatureHandlers, FeatureInfo {}

const FeatureEntry: React.FunctionComponent<FeatureEntryProps> = ({
  name,
  id,
  isHighlighted,
  onFeatureEntryMouseOver,
  onFeatureEntryMouseOut,
  onFeatureEntryClick,
}) => {
  return useMemo(
    () => (
      <div
        onMouseOver={() => onFeatureEntryMouseOver(id)}
        onMouseOut={() => onFeatureEntryMouseOut(id)}
        onClick={() => onFeatureEntryClick(id)}
        id={'feature' + id}
        className={[styles.feature, isHighlighted && styles.highlighted]
          .filter((e) => !!e)
          .join(' ')}
      >
        {name}
      </div>
    ),
    [
      isHighlighted,
      name,
      id,
      onFeatureEntryMouseOver,
      onFeatureEntryMouseOut,
      onFeatureEntryClick,
    ]
  );
};

export default FeatureEntry;
