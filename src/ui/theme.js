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
      mediumGreen,
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
    h2: {
      fontFamily: 'Muli',
      fontSize: '1.5rem',
      fontWeight: '700',
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
  },
})

export default theme
