import { TabContext, TabList, TabPanel } from '@mui/lab';
import AppBar from '@mui/material/AppBar';
import Tab from '@mui/material/Tab';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import withDrawer from '../../hoc/WithDrawer';
import PropertiesList from './PropertiesList';
import SuburbHeader from './SuburbHeader';
import SuburbHistory from './SuburbHistory';
import styles from './SuburbInfo.module.css';
import { selectSuburbInfoActiveTab, setSuburbInfoActiveTab } from './suburbInfoSlice';

const SuburbInfo: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const activeTab = useSelector(selectSuburbInfoActiveTab);

  const handleChange = (_event: React.ChangeEvent<unknown>, newValue: string) => {
    dispatch(setSuburbInfoActiveTab(newValue));
  };

  return (
    <div className={styles.suburbInfo}>
      <TabContext value={activeTab}>
        <AppBar position="static">
          <SuburbHeader />
          <TabList onChange={handleChange} aria-label="Suburb tabs">
            <Tab label="Properties" value="Properties" />
            <Tab label="History" value="History" />
          </TabList>
        </AppBar>
        <TabPanel className={styles.tabPanel} value="Properties">
          <PropertiesList />
        </TabPanel>
        <TabPanel className={styles.tabPanel} value="History">
          <SuburbHistory />
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default React.memo(withDrawer(SuburbInfo));
