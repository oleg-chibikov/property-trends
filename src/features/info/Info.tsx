import React from 'react';
import styles from './Info.module.css';
import Control from 'react-leaflet-control';

interface InfoProps {
  info: string;
}

const Info: React.FunctionComponent<InfoProps> = ({ info }) => (
  <Control position="topright">
    <div className={styles.info}>
      <h4>{info}</h4>
    </div>
  </Control>
);

export default Info;
