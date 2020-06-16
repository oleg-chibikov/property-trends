import React from 'react';
import styles from './Info.module.css';

interface InfoProps {
  info: string;
}

const Info: React.FunctionComponent<InfoProps> = ({ info }) => (
  <div className={styles.info}>
    <h4>{info}</h4>
  </div>
);

export default Info;
