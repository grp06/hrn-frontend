import { createMuiTheme } from '@material-ui/core/styles'

const lightPurple = '#723EBD'
const dankPurp = '#6327bb'
const orchid = '#e98dd7'
const sunray = '#fabb5b'
const independence = '#3a405a'
const white = '#fff'
const ghostWhite = '#f4f6fa'
const ghostWhiteSub = '#E2E8F2'
const ghostWhiteBody = '#D1D9EA'
const ghostWhiteDark = '#BFCBE2'
const bodyBlack = '#191919'
const greyBorder = '#3e4042'
const greyCard = '#242526'
const greyBoxShadow = '0 2px 12px rgba(0,0,0,0.2)'
const greyHighlight = '#2d2d2d'
const greyButton = '#323232'
const greyButtonHover = '#1c1c1c'
// const black1dp = '#1d1d1d'
const black2dp = '#212121'
const red = '#ff3333'
// const black3dp = '#232323'
// const black6dp = '#2c2c2c'

// HRN Lab Colors
// const softPurp = '#d2b6e5'
// const softOrchid = '#e3b6e5'
// const cottonCandy = '#8dd7e9'
// const lightSalmon = '#e99f8d'
// const sandDune = '#e9cd8d'
// const vanilla = '#fffce1'
// const vomit = '#7fbb27'
// const hiSky = '#5b9afa'
// const banana = '#ffdd43'

const theme = createMuiTheme({
  palette: {
    common: {
      dankPurp,
      lightPurple,
      orchid,
      sunray,
      ghostWhite,
      ghostWhiteSub,
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
      red,
    },
    primary: {
      main: dankPurp,
    },
    secondary: {
      main: orchid,
    },
    default: {
      main: sunray,
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
    // for very large numbers
    h2: {
      fontFamily: 'Muli',
      fontSize: '4.5rem',
      color: orchid,
    },
    // Event Title
    // 3REM
    h3: {
      fontFamily: 'Muli',
      color: ghostWhite,
      fontWeight: '600',
    },
    // Card Headers (login / signup form)
    // 2.12REM
    h4: {
      color: ghostWhite,
      fontFamily: 'Muli',
    },
    // Section Headers (Participants Signed Up)
    // 1.5REM
    h5: {
      fontFamily: 'Muli',
      color: ghostWhiteSub,
      marginBottom: '8px',
    },
    // 1.25REM
    h6: {
      fontFamily: 'Muli',
      color: ghostWhiteSub,
    },
    // 1REM
    subtitle1: {
      fontFamily: 'Muli',
      color: ghostWhiteSub,
      fontWeight: '300',
    },
    subtitle2: {
      fontFamily: 'Muli',
      color: ghostWhiteSub,
      fontSize: '0.8rem',
      fontWeight: '300',
    },
    body1: {
      fontFamily: 'Muli',
      color: ghostWhiteBody,
      fontWeight: '300',
    },
    p: {
      color: white,
    },
    waitingRoomHeading: {
      fontFamily: 'Muli',
      fontSize: '1.8rem',
      color: ghostWhiteSub,
      marginBottom: '24px',
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
        backgroundColor: greyBorder,
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
      text: {
        color: ghostWhite,
      },
      containedSizeLarge: {
        padding: '11px 11px',
        fontSize: '1.1rem',
      },
      contained: {
        backgroundColor: sunray,
        '&:hover': {
          backgroundColor: '#FCD08C',
        },
        '&.Mui-disabled': {
          backgroundColor: 'rgba(36,37,38,0.70)',
          color: 'rgba(191, 203, 226, 0.7)',
        },
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
    MuiListItemIcon: {
      root: {
        minWidth: '0',
      },
    },
    // MuiSnackbar: {
    //   bottom: 'none',
    //   top: '20px',
    // },
    MuiAlert: {
      filledInfo: {
        backgroundColor: sunray,
        color: bodyBlack,
      },
      filledSuccess: {
        backgroundColor: dankPurp,
      },
    },
    MuiStepLabel: {
      label: {
        fontSize: '1.25rem',
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
    MuiLinearProgress: {
      root: {
        width: '100%',
      },
    },
    MuiChip: {
      root: {
        borderRadius: '4px',
        margin: '5px',
      },
    },
  },
})

export default theme
