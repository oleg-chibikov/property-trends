import { Button } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import RealEstateMap from './features/realEstateMap/RealEstateMap';
import Sidebar from './features/sidebar/Sidebar';
import styles from './App.module.css';

const themeLight = createMuiTheme({
  palette: {
    type: 'light',
  },
});

const themeDark = createMuiTheme({
  palette: {
    type: 'dark',
  },
  overrides: {
    MuiFormLabel: {
      root: {
        '&$focused': {
          color: 'tomato',
          fontWeight: 'bold',
        },
      },

      focused: {},
    },
    MuiOutlinedInput: {
      root: {
        '& $notchedOutline': {
          borderColor: 'white',
        },
        '&:hover $notchedOutline': {
          borderColor: 'cyan',
        },
        '&$focused $notchedOutline': {
          borderColor: 'tomato',
        },
      },
    },
  },
});

const App = () => {
  const [light, setLight] = React.useState(false);
  return (
    <MuiThemeProvider theme={light ? themeLight : themeDark}>
      <CssBaseline />{' '}
      <div className={styles.container}>
        <header>
          Australian Property Trends
          <Button onClick={() => setLight((prev) => !prev)}>Toggle Theme</Button>
        </header>
        <div className={styles.map}>
          <RealEstateMap />
        </div>
        <Sidebar />
        <footer>Map</footer>
      </div>
    </MuiThemeProvider>
  );
};

export default App;

// TODO: search (geocoder or just by data which is in the kml), loading indicators for polygons and prices. Rent to Sell dynamics. Change of price dynamics (red - incresed comaring to past month/week, green - decreased, gray - no change)
