// @ts-nocheck
import { makeStyles } from '@material-ui/styles'

const useHostDirectoryStyles = makeStyles((theme) => ({
  // *****************************
  //   AggregateHostEventDataCard
  // *****************************
  aggregateHostEventDataCard: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    width: '100%',
  },
  detailsHeading: {
    padding: theme.spacing(1),
    textAlign: 'center',
  },
  // *****************************
  //   HostDirectory
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
  //   HostProfile
  // *****************************
  downloadButton: {
    alignItems: 'center',
    backgroundColor: theme.palette.common.basePurple,
    borderRadius: 4,
    color: theme.palette.common.ghostWhite,
    display: 'flex',
    flexWrap: 'nowrap',
    fontFamily: 'Muli',
    margin: theme.spacing(2, 'auto'),
    padding: '8px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    width: '175px',
  },
  hostedEventsContainer: {
    width: '85%',
    margin: theme.spacing(3, 'auto'),
  },
  // *****************************
  //   HostInfoCard
  // *****************************
  hostDirectoryAvatar: {
    height: '100%',
    width: '100%',
  },
  hostDirectoryAvatarContainer: {
    height: '120px',
    width: '120px',
  },
  hostInfoCardContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 3),
    },
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    margin: theme.spacing(3, 'auto'),
    padding: theme.spacing(3, 5),
    width: '85%',
  },
  hostInfoContentContainer: {
    marginLeft: theme.spacing(4),
    width: '40%',
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
    fontFamily: 'Muli',
  },
  expiredHostRow: {
    backgroundColor: '#c0392b',
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

export default useHostDirectoryStyles
