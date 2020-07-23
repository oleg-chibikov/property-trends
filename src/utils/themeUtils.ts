import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';

const pxToRem = (value: number) => `${value / 16}rem`;
const breakpoints = createBreakpoints({});
breakpoints.values.sm = 640;
breakpoints.values.md = 1024;
breakpoints.values.lg = 1440;

export default class ThemeUtils {
  static themeDark = responsiveFontSizes(
    createMuiTheme({
      breakpoints: breakpoints,
      palette: {
        type: 'dark',
        primary: {
          main: '#a22a11',
        },
        secondary: {
          main: '#e1d5cc',
        },
      },
      overrides: {
        MuiIconButton: {
          root: {
            [`${breakpoints.down('md')} and (orientation: landscape)`]: {
              padding: '0.2rem',
            },
          },
        },
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
            fontSize: pxToRem(10),
            [breakpoints.up('md')]: {
              fontSize: pxToRem(11),
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
        MuiFormGroup: {
          root: {
            flexWrap: 'nowrap', // force one column for district list
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
}
