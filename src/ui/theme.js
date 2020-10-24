import { createMuiTheme } from '@material-ui/core/styles'

const basePurple = '#8C57DB'
const basePink = '#FF99AD'
const sunray = '#fabb5b'
const ghostWhite = '#f4f6fa'
const ghostWhiteBody = '#E2E8F2'
const ghostWhiteDark = '#BFCBE2'
const bodyBlack = '#000000'
const greyBorder = '#3e4042'
const greySubtitle = '#BFBFBF'
const greyCard = '#191919'
const greyNav = '#1c1c1c'
const grey10 = '#262626'
const greyBoxShadow = '0 2px 12px rgba(0,0,0,0.2)'
const greyHighlight = '#2d2d2d'
const greyButton = '#323232'
const greyButtonHover = '#1c1c1c'
const black2dp = '#212121'
const red = '#ff3333'

const theme = createMuiTheme({
  palette: {
    common: {
      basePurple,
      basePink,
      sunray,
      ghostWhite,
      ghostWhiteBody,
      ghostWhiteDark,
      bodyBlack,
      greyCard,
      greyNav,
      greyBorder,
      greyBoxShadow,
      greyHighlight,
      greyButton,
      greyButtonHover,
      greySubtitle,
      red,
      grey10,
    },
    primary: {
      main: basePurple,
    },
    secondary: {
      main: basePink,
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
    // Event title on event page/lobby
    h1: {
      fontFamily: 'Muli',
      fontSize: '3rem',
      fontWeight: '600',
      lineHeight: 1.167,
      letterSpacing: '0em',
      color: ghostWhite,
    },
    // Event titlle on event thumbnail, Modals, Transitional Page, Card Header
    h2: {
      fontFamily: 'Muli',
      fontSize: '2.125rem',
      fontWeight: '400',
      lineHeight: 1.235,
      letterSpacing: '0.00735em',
      color: ghostWhite,
    },
    // Event Title
    // Buttons
    h3: {
      fontFamily: 'Muli',
      fontSize: '1.5rem',
      fontWeight: '700',
      lineHeight: 1.334,
      letterSpacing: '0em',
      color: ghostWhite,
    },
    // Card Headers (login / signup form)
    // 2.12REM
    h4: {
      fontFamily: 'Muli',
      fontSize: '1.25rem',
      fontWeight: '400',
      lineHeight: 1.6,
      letterSpacing: '0.0075em',
      color: ghostWhite,
    },
    h6: {
      color: 'ghostWhite',
      fontFamily: 'Muli',
    },
    // 1REM
    subtitle1: {
      fontFamily: 'Muli',
      color: greySubtitle,
      fontWeight: '300',
    },
    paragraph1: {
      fontSize: '50px',
    },
    subtitle2: {
      fontFamily: 'Muli',
      color: ghostWhiteBody,
      fontSize: '0.8rem',
      fontWeight: '300',
    },
    body1: {
      fontFamily: 'Muli',
      color: ghostWhiteBody,
      fontWeight: '300',
    },
    inEventScreenText: {
      fontFamily: 'Muli',
      fontSize: '1.75rem',
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '0.003em',
      color: ghostWhite,
      textAlign: 'center',
      marginBottom: '8px',
    },
    largeNumber: {
      fontFamily: 'Muli',
      fontSize: '3rem',
      fontWeight: 500,
      color: basePink,
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
        color: ghostWhiteBody,
        '&.Mui-focused': {
          color: basePink,
        },
      },
    },
    MuiInputLabel: {
      root: {
        color: ghostWhiteBody,
        fontSize: '1rem',
      },
      asterisk: {
        color: basePink,
      },
      formControl: {
        zIndex: 999,
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
      formControl: {
        marginTop: '20px',
      },
    },
    MuiInputBase: {
      input: {
        color: ghostWhiteBody,
        backgroundColor: grey10,
        borderRadius: '4px',
        padding: '8px 16px',
        marginTop: '8px',
      },
      inputMultiline: {
        padding: '8px 16px',
      },
    },
    MuiButton: {
      root: {
        color: ghostWhite,
        fontSize: '1rem',
        fontWeight: 700,
        maxHeight: '50px',
      },
      text: {
        color: ghostWhite,
        fontSize: '1rem',
      },
      containedSizeLarge: {
        padding: '11px 11px',
        fontSize: '1.1rem',
      },
      contained: {
        color: ghostWhite,
        minWidth: '200px',
        backgroundColor: greyButton,
        '&:hover': {
          backgroundColor: greyHighlight,
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
        color: ghostWhiteBody,
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
        backgroundColor: basePurple,
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
    MuiIconButton: {
      root: {
        color: sunray,
      },
    },
    MuiRating: {
      sizeLarge: {
        fontSize: '3.75rem',
      },
      iconEmpty: {
        color: 'inherit',
        fontSize: '3.75rem',
      },
    },
    MuiSpeedDialAction: {
      staticTooltipLabel: {
        backgroundColor: greyCard,
        color: ghostWhite,
        width: '175px',
        padding: '8px',
        textAlign: 'center',
      },
    },
    MuiMobileStepper: {
      root: {
        background: 'transparent',
      },
      dot: {
        backgroundColor: greyButton,
      },
    },
    MuiSelect: {
      icon: {
        color: ghostWhite,
      },
    },
    MuiRadio: {
      root: {
        color: grey10,
      },
    },
  },
})

export default theme
