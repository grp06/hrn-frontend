import { makeStyles } from '@material-ui/styles'

const useEventCompleteStyles = makeStyles((theme) => ({
  // *****************************
  //   BecomeAHostCard
  // *****************************
  backgroundLottie: {
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: -99,
  },
  becomeAHostButton: {
    margin: theme.spacing(3, 0, 1, 0),
    width: '100%',
  },
  becomeAHostCardContainer: {
    border: '2px solid #FF99AD',
    borderRadius: '4px',
    boxShadow: '4px 4px 0 #FF99AD',
    marginBottom: theme.spacing(3),
    position: 'relative',
  },
  becomeAHostHeroContent: {
    padding: theme.spacing(3, 5),
  },
  // *****************************
  //   EventComplete
  // *****************************
  connectionsContainer: {
    [theme.breakpoints.down('md')]: {
      width: '64%',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      width: '100%',
    },
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3, 5),
    width: '54%',
  },
  eventCompleteButtonCard: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3, 5),
  },
  eventCompleteButtonContainer: {
    [theme.breakpoints.down('md')]: {
      width: '34%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    marginBottom: theme.spacing(3),
    width: '44%',
  },
  eventCompleteCardTitle: {
    marginBottom: theme.spacing(3),
  },
  eventCompleteContentContainer: {
    [theme.breakpoints.down('xs')]: {
      width: '85vw',
    },
    margin: theme.spacing(-20, 'auto', 0, 'auto'),
    maxWidth: '1560px',
    paddingBottom: '40px',
    position: 'relative',
    width: '75vw',
    zIndex: '99',
  },
  // *****************************
  //   MyEventConnectionsList
  // *****************************
  inlineEmailText: {
    display: 'inline',
  },
  messageIcon: {
    '&:hover': {
      stroke: theme.palette.common.sunray,
    },
  },
}))

export default useEventCompleteStyles
