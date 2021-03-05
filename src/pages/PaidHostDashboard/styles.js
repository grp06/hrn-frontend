import { makeStyles } from '@material-ui/styles'

const usePaidHostDashboardStyles = makeStyles((theme) => ({
  // *****************************
  //   Paid Host Dashboard
  // *****************************
  activeTimeframeButton: {
    backgroundColor: theme.palette.common.basePink,
  },
  largeNumber: {
    fontSize: '10rem',
    marginTop: '-20px',
  },
  revenueNumber: {
    fontSize: '5rem',
    fontWeight: '500',
    color: '#00ff00',
    marginTop: '100px',
  },
  numberContainer: {
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(2, 0),
    },
  },
  numbersContainer: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    width: '90%',
    padding: theme.spacing(3, 5),
    margin: theme.spacing('100px', 'auto'),
  },

  // *****************************
  //   Host info table
  // *****************************

  aTag: {
    textDecoration: 'none',
    color: theme.palette.common.sunray,
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.common.ghostWhite,
    },
  },
  hostInfoContainer: {
    margin: theme.spacing(4, 'auto'),
    width: '75vw',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
  },
  table: {
    minWidth: 650,
  },
}))

export default usePaidHostDashboardStyles
