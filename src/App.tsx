import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import React from 'react';
import styles from './App.module.css';
import DistrictList from './features/districtList/DistrictList';
import Filters from './features/filters/Filters';
import RealEstateMap from './features/realEstateMap/RealEstateMap';
import SearchBox from './features/search/SearchBox';

const pxToRem = (value: number) => `${value / 16}rem`;

const breakpoints = createBreakpoints({});

breakpoints.values.sm = 640;
breakpoints.values.md = 1024;
breakpoints.values.lg = 1440;

const themeDark = responsiveFontSizes(
  createMuiTheme({
    breakpoints: breakpoints,
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
      MuiSvgIcon: {
        root: {
          verticalAlign: 'bottom',
        },
      },
      MuiTypography: {
        body1: {
          fontSize: pxToRem(12),
          [breakpoints.up('md')]: {
            fontSize: pxToRem(13),
          },
          [breakpoints.up('lg')]: {
            fontSize: pxToRem(14),
          },
        },
        body2: {
          fontSize: pxToRem(11),
          [breakpoints.up('md')]: {
            fontSize: pxToRem(12),
          },
          [breakpoints.up('lg')]: {
            fontSize: pxToRem(13),
          },
        },
        subtitle1: {
          fontSize: pxToRem(7),
          [breakpoints.up('md')]: {
            fontSize: pxToRem(10),
          },
          [breakpoints.up('lg')]: {
            fontSize: pxToRem(12),
          },
        },
      },
      MuiFormControl: {
        root: {
          width: '100%',
        },
        marginNormal: {
          marginTop: '0.3rem',
          marginBottom: 0,
          [breakpoints.up('lg')]: {
            marginBottom: '0.5rem',
          },
        },
      },
      MuiSlider: {
        markLabel: {
          fontSize: pxToRem(8),
          [breakpoints.up('md')]: {
            fontSize: pxToRem(9),
          },
          [breakpoints.up('lg')]: {
            fontSize: pxToRem(10),
          },
        },
        marked: {
          marginBottom: 0,
        },
      },
      MuiSelect: {
        root: {
          padding: '0.5rem',
          [breakpoints.up('md')]: {
            padding: '0.6rem',
          },
          [breakpoints.up('lg')]: {
            padding: '0.7rem',
          },
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
  })
);

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
// Rent to Sell dynamics
// Change of price dynamics (red - incresed comaring to past month/week, green - decreased, gray - no change)
// Themes
// Property add form
