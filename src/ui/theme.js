import { createMuiTheme } from '@material-ui/core/styles'

const rebeccaPurple = '#6638aa'
const orchid = '#df97d1'
const ghostWhite = '#f4f6fa'
const sunray = '#edb868'
const independence = '#3a405a'

const theme = createMuiTheme({
  palette: {
    common: {
      rebeccaPurple,
      orchid,
    },
    primary: {
      main: rebeccaPurple,
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
      fontSize: '1rem',
      color: ghostWhite,
    },
    headerButton: {
      fontFamily: 'Muli',
      fontSize: '1rem',
      textTransform: 'none',
      color: ghostWhite,
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
