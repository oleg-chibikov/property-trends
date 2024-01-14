import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// The breakpoints API has changed in v5
const theme = createTheme();
const breakpoints = theme.breakpoints;

// Update values for breakpoints
breakpoints.values.sm = 640;
breakpoints.values.md = 1024;
breakpoints.values.lg = 1440;

const ThemeUtils = {
  themeDark: responsiveFontSizes(
    createTheme({
      breakpoints,
      palette: {
        mode: 'dark', // 'type' has been replaced with 'mode'
        primary: {
          main: '#a22a11',
        },
        secondary: {
          main: '#e1d5cc',
        },
      },
      components: {
        MuiToggleButton: {
          styleOverrides: {
            sizeSmall: {
              padding: '0.1rem',
            },
          },
        },
        MuiSvgIcon: {
          styleOverrides: {
            root: {
              verticalAlign: 'bottom',
            },
          },
        },
        MuiTypography: {
          styleOverrides: {
            body1: {
              fontSize: '0.75rem', // Adjust the values accordingly
              [breakpoints.up('md')]: {
                fontSize: '0.8125rem',
              },
              [breakpoints.up('lg')]: {
                fontSize: '0.875rem',
              },
            },
            body2: {
              fontSize: '0.6875rem',
              [breakpoints.up('md')]: {
                fontSize: '0.75rem',
              },
              [breakpoints.up('lg')]: {
                fontSize: '0.8125rem',
              },
            },
            subtitle1: {
              fontSize: '0.625rem',
              [breakpoints.up('md')]: {
                fontSize: '0.6875rem',
              },
              [breakpoints.up('lg')]: {
                fontSize: '0.75rem',
              },
            },
          },
        },
        MuiFormControl: {
          styleOverrides: {
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
        },
        MuiFormGroup: {
          styleOverrides: {
            root: {
              flexWrap: 'nowrap', // force one column for district list
            },
          },
        },
        MuiSlider: {
          styleOverrides: {
            markLabel: {
              fontSize: '0.5rem',
              [breakpoints.up('md')]: {
                fontSize: '0.5625rem',
              },
              [breakpoints.up('lg')]: {
                fontSize: '0.625rem',
              },
            },
            marked: {
              marginBottom: 0,
            },
            track: {
              height: 6,
              marginTop: -2,
            },
            mark: {
              height: 4,
              marginTop: -1,
              width: 4,
              '&$markActive': {
                height: 6,
                marginTop: -2,
                width: 4,
              },
            },
            thumb: {
              height: 16,
              width: 16,
              backgroundColor: '#fff',
              border: '2px solid currentColor',
              marginTop: -8,
              marginLeft: -8,
              '&:focus, &:hover, &$active': {
                boxShadow: 'inherit',
              },
            },
          },
        },
        MuiSelect: {
          styleOverrides: {
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
        },
        MuiAccordion: {
          styleOverrides: {
            root: {
              '&.innerAccordion .MuiCheckbox-root': {
                marginRight: '0.3rem',
                padding: '0.1rem',
              },
              backgroundColor: '#262626',
            },
          },
        },
        MuiAccordionDetails: {
          styleOverrides: {
            root: {
              '&.innerAccordionDetails': {
                maxHeight: '20rem',
                overflow: 'auto',
                scrollBehavior: 'smooth',
                whiteSpace: 'break-spaces',
                padding: '0.5rem',
                '& .MuiFormGroup-root': {
                  width: '100%',
                  padding: '0 0.8rem',
                },
              },
              '& .MuiFormGroup-root': {
                width: '100%',
              },
              padding: 0,
            },
          },
        },
      },
    })
  ),
};

export default ThemeUtils;
