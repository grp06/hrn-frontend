import { createMuiTheme } from '@material-ui/core/styles'

const rebeccaPurple = '#6638aa'
const orchid = '#df97d1'
const materialPink = '#ffb6ec'
const ghostWhite = '#f4f6fa'
const ghostWhite5 = '#E2E8F2'
const ghostWhite10 = '#D1D9EA'
const ghostWhite15 = '#BFCBE2'
const sunray = '#edb868'
const independence = '#3a405a'
const mediumGreen = '#4eab6d'
const white = '#fff'
const black = '#191919'
const greyBorder = '#3e4042'
const greyCard = '#242526'
const greyBoxShadow = '0 2px 12px rgba(0,0,0,0.2)'
const black1dp = '#1c1c1c'
const black3dp = '#232323'
const black6dp = '#2c2c2c'
const black8dp = '#2d2d2d'
const black12dp = '#323232'

const theme = createMuiTheme({
  palette: {
    common: {
      rebeccaPurple,
      orchid,
      ghostWhite,
      ghostWhite10,
      ghostWhite15,
      independence,
      materialPink,
      greyCard,
      greyBorder,
      greyBoxShadow,
      black8dp,
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
    },
    body1: {
      fontFamily: 'Muli',
      fontSize: '1rem',
      color: ghostWhite10,
    },
    modalBody: {
      fontFamily: 'Muli',
      fontSize: '1.3rem',
      color: independence,
    },
    p: {
      color: white,
    },
  },
  overrides: {
    MuiInputLabel: {
      root: {
        color: rebeccaPurple,
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
        color: ghostWhite5,
      },
      secondary: {
        color: ghostWhite15,
      },
    },
  },
})

export default theme
