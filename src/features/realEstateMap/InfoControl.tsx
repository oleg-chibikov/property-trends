import React from 'react';
import styles from './InfoControl.module.css';
import Control from 'react-leaflet-control';

interface InfoControlProps {
  info: string;
}

const InfoControl: React.FunctionComponent<InfoControlProps> = ({ info }) => (
  <Control position="topright">
    <div className={styles.info}>
      <h4>{info}</h4>
    </div>
  </Control>
);

export default InfoControl;
