import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import styles from './App.module.css';
import DistrictList from './features/districtList/DistrictList';
import Filters from './features/filters/Filters';
import RealEstateMap from './features/realEstateMap/RealEstateMap';
import SearchBox from './features/search/SearchBox';

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
    MuiAccordion: {
      root: {
        '&.innerAccordion .MuiCheckbox-root': {
          marginRight: '0.3rem',
          padding: '0.1rem',
        },
        backgroundColor: '#262626',
      },
    },
    MuiAccordionDetails: {
      root: {
        '&.innerAccordionDetails': {
          maxHeight: '20rem',
          overflow: 'auto',
          '& .MuiFormGroup-root': {
            width: '100%',
            padding: '0 0.8rem',
          },
        },
        '& .MuiFormGroup-root': {
          width: '100%',
        },
        padding: '0.5rem',
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
      <CssBaseline />
      <div className={styles.container}>
        <header>
          <div className={styles.left}>APT</div>
          <div className={styles.center}>
            <SearchBox />
          </div>
        </header>
        <nav>
          <Filters />
        </nav>
        <main>
          <RealEstateMap />
        </main>
        <aside>
          <DistrictList />
        </aside>
        <footer>Australian Property Trends 2020</footer>
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
