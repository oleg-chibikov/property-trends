import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import React from 'react';
import { Popup } from 'react-leaflet';
import { useSelector } from 'react-redux';
import DomainUtils from '../../utils/domainUtils';
import styles from './Popup.module.css';
import { selectPopupPosition, selectSuburbKey } from './popupSlice';
import SuburbInfo from './SuburbInfo';

const width = 400;

let popupIndex = 0;

const CustomPopup: React.FunctionComponent = () => {
  const popupPosition = useSelector(selectPopupPosition);
  const suburbKey = useSelector(selectSuburbKey);
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.ChangeEvent<any>, newValue: string) => {
    setValue(newValue);
  };

  if (!popupPosition || !suburbKey) {
    return null;
  }
  return (
    <Popup maxWidth={width} key={`popup-${suburbKey.postCode}-${suburbKey.locality}-${popupIndex++}`} position={popupPosition} autoClose={true}>
      <div style={{ width: width }}>
        <TabContext value={value}>
          <AppBar position="static">
            <h4 className={styles.header}>
              {suburbKey.locality} {DomainUtils.padPostCode(suburbKey.postCode)}
            </h4>
            <TabList onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Properties" value="1" />
              <Tab label="History" value="2" />
            </TabList>
          </AppBar>
          <TabPanel value="1">
            <SuburbInfo />
          </TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
        </TabContext>
      </div>
    </Popup>
  );
};

export default React.memo(CustomPopup);
