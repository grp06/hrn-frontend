import { makeStyles } from '@material-ui/styles'

const useHRNAnalyticsStyles = makeStyles((theme) => ({
  // *****************************
  //   EventExpansionPanelAdmin
  // *****************************
  aTag: {
    '&:hover': {
      color: theme.palette.common.ghostWhite,
    },
    color: theme.palette.common.sunray,
    cursor: 'pointer',
    fontFamily: 'Muli',
    textDecoration: 'none',
  },
  downloadButton: {
    '& svg': {
      marginLeft: theme.spacing(1),
    },
    alignItems: 'center',
    backgroundColor: theme.palette.common.basePurple,
    borderRadius: 4,
    color: theme.palette.common.ghostWhite,
    display: 'flex',
    flexWrap: 'nowrap',
    fontFamily: 'Muli',
    margin: `0 8px 8px 8px`,
    padding: '8px 20px',
    textAlign: 'center',
    textDecoration: 'none',
  },
  eventPanelHeading: {
    color: theme.palette.common.ghostWhite,
    flexBasis: '33.33%',
    flexShrink: 0,
    marginBottom: 0,
  },
  expansionPanelDetailsHeading: {
    padding: theme.spacing(1),
    textAlign: 'center',
  },
  expansionPanelSectionHeading: {
    margin: theme.spacing(2),
    textDecoration: 'underline',
  },
  // *****************************
  //   HRNAnalytics
  // *****************************
  expansionPanelsContainer: {
    margin: theme.spacing(0, 'auto'),
    width: '75vw',
  },
  hrnAnalyticsPageContainer: {
    marginTop: '200px',
  },
  largeNumber: {
    ...theme.typography.largeNumber,
  },
  systemNumbersSnapshotContainer: {
    margin: theme.spacing(0, 'auto', 5, 'auto'),
    width: '50vw',
  },
}))

export default useHRNAnalyticsStyles
