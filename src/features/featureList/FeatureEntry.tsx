import React from 'react';
import styles from './FeatureList.module.css';
import PropTypes from 'prop-types';
import { FeatureEntryEventHandlers, FeatureInfo } from '../../interfaces';

interface FeatureEntryProps extends FeatureEntryEventHandlers, FeatureInfo {}

const FeatureEntry: React.FunctionComponent<FeatureEntryProps> = ({ name, suburbId, isHighlighted, color, onItemMouseOver, onItemMouseOut, onItemClick }) => (
  <div
    style={{ backgroundColor: color }}
    onMouseOver={() => onItemMouseOver(suburbId)}
    onMouseOut={() => onItemMouseOut(suburbId)}
    onClick={() => onItemClick(suburbId)}
    id={'feature' + suburbId}
    className={[styles.feature, isHighlighted && styles.highlighted].filter((e) => !!e).join(' ')}
  >
    {name}
  </div>
);

FeatureEntry.propTypes = {
  name: PropTypes.string.isRequired,
  suburbId: PropTypes.string.isRequired,
  isHighlighted: PropTypes.bool,
  color: PropTypes.string,
  onItemMouseOver: PropTypes.func.isRequired,
  onItemMouseOut: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export default React.memo(FeatureEntry);
