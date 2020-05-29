import { createMuiTheme } from '@material-ui/core/styles'

const rebeccaPurple = '#6638aa'
const orchid = '#df97d1'
const ghostWhite = '#f4f6fa'
const sunray = '#edb868'
const independence = '#3a405a'
const mediumGreen = '#4eab6d'

const theme = createMuiTheme({
  palette: {
    common: {
      rebeccaPurple,
      orchid,
      ghostWhite,
      independence,
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
    subtitle1: {
      fontFamily: 'Muli',
      color: ghostWhite,
    },
    body: {
      fontFamily: 'Muli',
      fontSize: '1rem',
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
  },
})

export default theme
