import { makeStyles } from '@material-ui/styles'

const useHostDashboardStyles = makeStyles((theme) => ({
  // *****************************
  //   HostDashboard
  // *****************************
  dashboardSectionHeader: {
    marginBottom: theme.spacing(3),
  },
  expansionPanelContent: {
    [theme.breakpoints.down('md')]: {
      width: '60vw',
    },
    [theme.breakpoints.down('xs')]: {
      width: '85vw',
    },
    margin: theme.spacing(0, 'auto'),
    width: '75vw',
  },
  hostDashboardPageContainer: {
    marginTop: '100px',
    paddingLeft: '25px',
    paddingRight: '25px',
  },
  noEventsContainer: {
    marginTop: '150px',
  },
  noEventsMessage: {
    padding: theme.spacing(2, 0, 1, 0),
    textAlign: 'center',
  },
  // *****************************
  //   HostEventsExpansionPanel
  // *****************************
  aTag: {
    textDecoration: 'none',
    fontFamily: 'Muli',
    textAlign: 'center',
    fontSize: '1.25rem',
    color: theme.palette.common.sunray,
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.common.ghostWhite,
    },
  },
  detailsHeading: {
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  downloadButton: {
    backgroundColor: theme.palette.common.basePurple,
    color: theme.palette.common.ghostWhite,
    padding: '8px 20px',
    margin: `0 8px 8px 8px`,
    textDecoration: 'none',
    fontFamily: 'Muli',
    borderRadius: 4,
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    textAlign: 'center',
    '& svg': {
      marginLeft: theme.spacing(1),
    },
  },
  eventPanelHeading: {
    flexBasis: '33.33%',
    flexShrink: 0,
    marginBottom: 0,
    color: theme.palette.common.ghostWhite,
  },
  expansionPanel: {
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '4px 4px 0 #3e4042',
  },
  // *****************************
  //   HostMetricsSnapshot
  // *****************************
  metricContainer: {
    height: '30%',
    width: '90%',
    [theme.breakpoints.down('md')]: {
      width: '30%',
      height: '90%',
    },
  },
  metricHeader: {
    marginBottom: 0,
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      width: '70%',
      fontSize: '1.5rem',
      margin: theme.spacing(0, 'auto'),
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem',
    },
  },
  metricNumber: {
    ...theme.typography.largeNumber,
    color: theme.palette.common.ghostWhite,
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      fontSize: '2.5rem',
    },
  },
  purpleText: {
    color: theme.palette.common.lightPurple,
  },
  pinkText: {
    color: theme.palette.common.basePink,
  },
  snapshotGraphContainer: {
    height: '100%',
    [theme.breakpoints.down('md')]: {
      height: '250px',
      marginBottom: '20px',
    },
  },
  totalMetricsContainer: {
    height: '100%',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'row',
    },
  },
  totalSnapshotGrid: {
    padding: theme.spacing(5),
    width: '100%',
    height: '575px',
    [theme.breakpoints.down('md')]: {
      height: 'auto',
    },
  },
  yellowText: {
    color: theme.palette.common.sunray,
  },
}))

export default useHostDashboardStyles
