import PropTypes from 'prop-types';
import React from 'react';
import { FeatureEntryEventHandlers, FeatureInfo } from '../../interfaces';
import styles from './FeatureList.module.css';

interface FeatureEntryProps extends FeatureEntryEventHandlers, FeatureInfo {}

const FeatureEntry: React.FunctionComponent<FeatureEntryProps> = ({ name, suburbId, isHighlighted, color, onItemMouseOver, onItemMouseOut, onItemClick }) => (
  <div
    style={{ backgroundColor: color + 'B3' }} // addional value means opacity https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4
    onMouseOver={() => onItemMouseOver(suburbId)}
    onMouseOut={() => onItemMouseOut(suburbId)}
    onClick={() => onItemClick(suburbId)}
    id={'feature' + suburbId}
    className={[styles.feature, isHighlighted && styles.highlighted, color && styles.colorized].filter((e) => !!e).join(' ')}
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
