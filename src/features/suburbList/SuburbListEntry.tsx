import React from 'react';
import { SuburbInfo, SuburbListEntryEventHandlers } from '../../interfaces';
import styles from './SuburbList.module.css';

interface FeatureEntryProps extends SuburbListEntryEventHandlers, SuburbInfo {}

const SuburbListEntry: React.FunctionComponent<FeatureEntryProps> = ({ name, suburbId, isHighlighted, color, onItemMouseOver, onItemMouseOut, onItemClick }) => (
  <div
    style={{ backgroundColor: color + 'B3' }} // addional value means opacity https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4
    onMouseOver={() => onItemMouseOver(suburbId)}
    onMouseOut={() => onItemMouseOut(suburbId)}
    onClick={() => onItemClick(suburbId)}
    id={'suburb' + suburbId}
    className={[isHighlighted ? styles.highlighted : styles.unhighlighted, color && styles.colorized].filter((e) => !!e).join(' ')}
  >
    {name}
  </div>
);

export default React.memo(SuburbListEntry);
