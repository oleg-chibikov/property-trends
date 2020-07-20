import { MuiThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import styles from './App.module.css';
import DistrictListButton from './features/districtList/DistrictListButton';
import DistrictListWithDrawer from './features/districtList/DistrictListWithDrawer';
import FiltersButton from './features/filters/FiltersButton';
import FiltersWithDrawer from './features/filters/FiltersWithDrawer';
import RealEstateMap from './features/realEstateMap/RealEstateMap';
import SearchBoxWithDrawer from './features/search/SearchBoxWithDrawer';
import ThemeUtils from './utils/themeUtils';

const App = () => {
  return (
    <MuiThemeProvider theme={ThemeUtils.themeDark}>
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
      </div>
    </MuiThemeProvider>
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
