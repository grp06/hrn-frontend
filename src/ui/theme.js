import { createMuiTheme } from '@material-ui/core/styles'

const rebeccaPurple = '#6638aa'
const orchid = '#df97d1'
const materialPink = '#ffb6ec'
const ghostWhite = '#f4f6fa'
const ghostWhiteSub = '#E2E8F2'
const ghostWhiteBody = '#D1D9EA'
const ghostWhiteDark = '#BFCBE2'
const sunray = '#edb868'
const independence = '#3a405a'
const mediumGreen = '#4eab6d'
const white = '#fff'
const bodyBlack = '#191919'
const greyBorder = '#3e4042'
const greyCard = '#242526'
const greyBoxShadow = '0 2px 12px rgba(0,0,0,0.2)'
const greyHighlight = '#2d2d2d'
const greyButton = '#323232'
const black1dp = '#1c1c1c'
const black3dp = '#232323'
const black6dp = '#2c2c2c'

const theme = createMuiTheme({
  palette: {
    common: {
      rebeccaPurple,
      orchid,
      ghostWhite,
      ghostWhiteBody,
      ghostWhiteDark,
      independence,
      materialPink,
      bodyBlack,
      greyCard,
      greyBorder,
      greyBoxShadow,
      greyHighlight,
      greyButton,
    },
    primary: {
      main: rebeccaPurple,
    },
    secondary: {
      main: orchid,
    },
    green: {
      main: mediumGreen,
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
      color: ghostWhite,
    },
    h2: {
      fontFamily: 'Muli',
      fontSize: '1.5rem',
      fontWeight: '700',
      marginBottom: '10px',
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
      fontSize: '1.3rem',
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
        backgroundColor: 'transparent',
      },
    },
    // this is for the boxshadow on the navbar
    MuiPaper: {
      elevation4: {
        boxShadow: 'none',
      },
    },
    MuiInputLabel: {
      root: {
        color: orchid,
        fontSize: '1rem',
      },
    },
    MuiInput: {
      underline: {
        '&:before': {
          borderBottom: `2px solid ${rebeccaPurple}`,
        },
        '&:hover:not(disabled):not($focused):not($error):before': {
          borderBottom: `2px solid ${rebeccaPurple}`,
        },
      },
    },
    MuiInputBase: {
      input: {
        color: ghostWhiteBody,
      },
    },
    MuiButton: {
      containedSizeLarge: {
        padding: '20px 20px',
        fontSize: '1.2rem',
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
  },
})

export default theme
