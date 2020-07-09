import { createMuiTheme } from '@material-ui/core/styles'

const rebeccaPurple = '#6638aa'
const lightPurple = '#723EBD'
const dankPurp = '#6327bb'
const orchid = '#e98dd7'
const oldPink = '#df97d1'
const ghostWhite = '#f4f6fa'
const ghostWhiteSub = '#E2E8F2'
const ghostWhiteBody = '#D1D9EA'
const ghostWhiteDark = '#BFCBE2'
const sunray = '#fabb5b'
const oldYellow = '#edb868'
const independence = '#3a405a'
// const mediumGreen = '#4eab6d'
const white = '#fff'
const bodyBlack = '#191919'
const greyBorder = '#3e4042'
const greyCard = '#242526'
const greyBoxShadow = '0 2px 12px rgba(0,0,0,0.2)'
const greyHighlight = '#2d2d2d'
const greyButton = '#323232'
const greyButtonHover = '#1c1c1c'
// const black1dp = '#1d1d1d'
const black2dp = '#212121'
// const black3dp = '#232323'
// const black6dp = '#2c2c2c'

const theme = createMuiTheme({
  palette: {
    common: {
      dankPurp,
      lightPurple,
      orchid,
      sunray,
      ghostWhite,
      ghostWhiteBody,
      ghostWhiteDark,
      independence,
      bodyBlack,
      greyCard,
      greyBorder,
      greyBoxShadow,
      greyHighlight,
      greyButton,
      greyButtonHover,
    },
    primary: {
      main: dankPurp,
    },
    secondary: {
      main: orchid,
    },
  },
  typography: {
    tab: {
      fontFamily: 'Muli',
      textTransform: 'none',
      fontWeight: '700',
      fontSize: '0.8rem',
      color: ghostWhite,
    },
    headerButton: {
      fontFamily: 'Muli',
      fontSize: '0.8rem',
      textTransform: 'none',
      color: ghostWhite,
    },
    h1: {
      fontFamily: 'Muli',
      fontSize: '2.3rem',
      fontWeight: '700',
      lineHeight: '2.9rem',
      color: ghostWhite,
    },
    h2: {
      fontFamily: 'Muli',
      fontSize: '1.5rem',
      fontWeight: '700',
      marginBottom: '10px',
      lineHeight: '2rem',
    },
    h3: {
      fontFamily: 'Muli',
      fontSize: '1.3rem',
      fontWeight: '500',
      marginBottom: '7px',
    },
    h4: {
      color: ghostWhite,
    },
    subtitle1: {
      fontFamily: 'Muli',
      color: ghostWhite,
    },
    body: {
      fontFamily: 'Muli',
      fontSize: '1rem',
      color: ghostWhite,
      fontWeight: '300',
    },
    body1: {
      fontFamily: 'Muli',
      fontSize: '1rem',
      color: ghostWhiteBody,
      fontWeight: '300',
    },
    modalBody: {
      fontFamily: 'Muli',
      fontSize: '1.2rem',
      color: ghostWhite,
    },
    p: {
      color: white,
    },
    waitingRoomHeading: {
      fontFamily: 'Muli',
      fontSize: '1.8rem',
      color: ghostWhiteSub,
      marginBottom: '25px',
      width: '100%',
      lineHeight: '2.3rem',
      fontWeight: '500',
      textAlign: 'center',
    },
  },
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: black2dp,
      },
    },
    MuiToolbar: {
      root: { padding: '0 10px' },
    },
    // this is for the boxshadow on the navbar
    MuiPaper: {
      root: {
        backgroundColor: 'transparent',
      },
      rounded: {
        backgroundColor: '#fff',
      },
      elevation4: {
        boxShadow: 'none',
      },
      elevation1: {
        border: '1px solid #f4f6fa',
        boxShadow: '3px 3px 0 #f4f6fa',
        // border: '1px solid #fabb5b',
        // boxShadow: '3px 3px 0 #fabb5b',
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: ghostWhiteSub,
      },
    },
    MuiExpansionPanel: {
      root: {
        backgroundColor: greyCard,
        // '&.Mui-expanded': {
        //   backgroundColor: greyHighlight,
        // },
        padding: 8,
      },
    },
    MuiExpansionPanelSummary: {
      content: {
        alignItems: 'center',
      },
    },
    MuiFormLabel: {
      root: {
        color: ghostWhiteSub,
        '&.Mui-focused': {
          color: orchid,
        },
      },
    },
    MuiInputLabel: {
      root: {
        color: ghostWhiteSub,
        fontSize: '1rem',
      },
      shrink: {
        color: orchid,
      },
    },
    MuiInput: {
      underline: {
        '&:before': {
          borderBottom: `2px solid ${greyBorder}`,
        },
        '&:hover:not(disabled):not($focused):not($error):before': {
          borderBottom: `2px solid ${greyBorder}`,
        },
        '&:after': {
          borderBottom: `2px solid ${ghostWhiteDark}`,
        },
      },
    },
    MuiInputBase: {
      input: {
        color: ghostWhiteBody,
      },
    },
    MuiButton: {
      root: {
        color: 'inherit',
        fontWeight: 'inherit',
      },
      containedSizeLarge: {
        padding: '11px 11px',
        fontSize: '1.1rem',
      },
      contained: {
        backgroundColor: sunray,
      },
    },
    MuiFab: {
      extended: {
        borderRadius: '4px',
        color: ghostWhite,
      },
    },
    MuiListItemText: {
      primary: {
        color: ghostWhiteSub,
      },
      secondary: {
        color: ghostWhiteDark,
      },
    },
    MuiSnackbar: {
      bottom: 'none',
      top: '20px',
    },
    MuiAlert: {
      filledInfo: {
        backgroundColor: sunray,
      },
    },
    MuiStepLabel: {
      label: {
        fontSize: '1.2rem',
        fontWeight: '400',
        color: ghostWhite,
        '&.MuiStepLabel-active': {
          color: ghostWhite,
        },
        '&.MuiStepLabel-completed ': {
          color: ghostWhite,
        },
      },
    },
    MuiStepIcon: {
      root: {
        width: '25px',
        height: '25px',
      },
    },
  },
})

export default theme
