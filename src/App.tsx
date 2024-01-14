import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import styles from './App.module.css';
import DistrictListButton from './features/districtList/DistrictListButton';
import DistrictListWithDrawer from './features/districtList/DistrictListWithDrawer';
import FiltersButton from './features/filters/FiltersButton';
import FiltersWithDrawer from './features/filters/FiltersWithDrawer';
import RealEstateMap from './features/realEstateMap/RealEstateMap';
import SearchBoxWithDrawer from './features/search/SearchBoxWithDrawer';
import SuburbInfoWithDrawer from './features/suburbInfo/SuburbInfoWithDrawer';
import ThemeUtils from './utils/themeUtils';

const App = () => {
  return (
    <ThemeProvider theme={ThemeUtils.themeDark}>
      <CssBaseline />
      <SearchBoxWithDrawer />
      <div className={styles.wrapper}>
        <FiltersWithDrawer />
        <div className={styles.container}>
          {/* <header>
            <div className={styles.left}>APT</div>
            <div className={styles.right}>Blah</div>
          </header> */}
          <nav>
            <FiltersButton />
            <DistrictListButton />
          </nav>
          <main>
            <RealEstateMap />
          </main>
          <footer>Australian Property Trends 2020</footer>
        </div>
        <DistrictListWithDrawer />
        <SuburbInfoWithDrawer />
        <div className="tooltip"></div>
      </div>
    </ThemeProvider>
  );
};

export default App;

// TODO: load suburbs at the center of current viewport (difficult)
// By default show suburbs around user's location
// Rent to Sell dynamics
// Change of price dynamics (red - incresed comaring to past month/week, green - decreased, gray - no change)
// Themes
// Property add form
// SEO - at least should be somehow found in google
// place site and retriever on the same hosting
// Error alerts
// Load suburbs one by one? signalR?
// Store last filter in cookies
// Get data by post code and not by post-code + suburb
// Get data for sold channel
// Display Sold properties with flag
// Display properties as dots on map
