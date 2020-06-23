import React from 'react';
import styles from './FeatureList.module.css';
import PropTypes from 'prop-types';
import { FeatureHandlers, FeatureInfo } from '../../interfaces';

interface FeatureEntryProps extends FeatureHandlers, FeatureInfo {}

const FeatureEntry: React.FunctionComponent<FeatureEntryProps> = ({ name, id, isHighlighted, onFeatureEntryMouseOver, onFeatureEntryMouseOut, onFeatureEntryClick }) => (
  <div
    onMouseOver={() => onFeatureEntryMouseOver(id)}
    onMouseOut={() => onFeatureEntryMouseOut(id)}
    onClick={() => onFeatureEntryClick(id)}
    id={'feature' + id}
    className={[styles.feature, isHighlighted && styles.highlighted].filter((e) => !!e).join(' ')}
  >
    {name}
  </div>
);

FeatureEntry.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isHighlighted: PropTypes.bool,
  onFeatureEntryMouseOver: PropTypes.func.isRequired,
  onFeatureEntryMouseOut: PropTypes.func.isRequired,
  onFeatureEntryClick: PropTypes.func.isRequired,
};

export default React.memo(FeatureEntry);
