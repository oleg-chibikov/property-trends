import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import styles from './App.module.css';
import RealEstateMap from './features/realEstateMap/RealEstateMap';
import SearchBox from './features/search/SearchBox';
import Sidebar from './features/sidebar/Sidebar';

const themeDark = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#a22a11',
    },
    secondary: {
      main: '#d32f2f',
    },
  },
  overrides: {
    MuiFormControlLabel: {
      label: {
        fontSize: '0.7rem',
      },
    },
    MuiFormControl: {
      root: {
        width: '100%',
      },
    },
    MuiFormGroup: {
      root: {
        maxHeight: '110px',
        '& .MuiCheckbox-root': {
          marginRight: '5px',
          padding: '2px',
        },
      },
    },
    // MuiFormLabel: {
    //   root: {
    //     '&$focused': {
    //       color: 'tomato',
    //       fontWeight: 'bold',
    //     },
    //   },

    //   focused: {},
    // },
    // MuiOutlinedInput: {
    //   root: {
    //     '& $notchedOutline': {
    //       borderColor: 'white',
    //     },
    //     '&:hover $notchedOutline': {
    //       borderColor: 'cyan',
    //     },
    //     '&$focused $notchedOutline': {
    //       borderColor: 'tomato',
    //     },
    //   },
    // },
  },
});

const App = () => {
  return (
    <MuiThemeProvider theme={themeDark}>
      <CssBaseline />{' '}
      <div className={styles.container}>
        <header>
          <div className={styles.left}>Australian Property Trends</div>
          <div className={styles.center}>
            <SearchBox />
          </div>
          <div className={styles.right}></div>
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

// TODO: load suburbs at the center of current viewport (difficult)
// By default show suburbs around user's location
// Mobile layout
// Rent to Sell dynamics
// Change of price dynamics (red - incresed comaring to past month/week, green - decreased, gray - no change)
// Themes
