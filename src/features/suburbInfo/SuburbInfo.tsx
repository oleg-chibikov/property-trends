import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import withDrawer from '../../hoc/WithDrawer';
import PropertiesList from './PropertiesList';
import SuburbHeader from './SuburbHeader';
import SuburbHistory from './SuburbHistory';
import styles from './SuburbInfo.module.css';
import { selectSuburbInfoActiveTab, setSuburbInfoActiveTab } from './suburbInfoSlice';

const SuburbInfo: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector(selectSuburbInfoActiveTab);

  const handleChange = (event: React.ChangeEvent<unknown>, newValue: string) => {
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
