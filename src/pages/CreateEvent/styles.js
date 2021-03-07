import { makeStyles } from '@material-ui/styles'

const useCreateEventStyles = makeStyles((theme) => ({
  // *****************************
  //   CreateEvent
  // *****************************
  createEventPageContainer: {
    padding: theme.spacing(4, 0),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(10, 0),
    },
  },
  // *****************************
  //   MatchingOptionCard
  // *****************************
  matchingIcon: {
    height: '100%',
    width: '100%',
  },
  matchingOptionCardContainer: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.common.greyButtonHover,
    },
    backgroundColor: theme.palette.common.grey10,
    borderRadius: '4px',
    padding: theme.spacing(3),
    height: '150px',
    width: '48%',
    margin: theme.spacing(2, 1),
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: 'auto',
    },
  },
  matchingOptionCardGrid: {
    [theme.breakpoints.down('md')]: {
      flexWrap: 'wrap',
    },
  },
  selectedMatchingOption: {
    border: '2px solid #FF99AD',
  },
  // *****************************
  //   NewEventForm
  // *****************************
  eventFormContainer: {
    width: '85%',
    height: 'auto',
    maxWidth: '1560px',
    margin: theme.spacing(0, 'auto', 0, 'auto'),
  },
  eventFormInputMargin: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(0, 1),
  },
  pinkText: {
    color: theme.palette.common.basePink,
  },
  publicEventLabel: {
    fontSize: '0.75rem',
  },
  sectionContainer: {
    margin: theme.spacing(4, 0),
  },
  // *****************************
  //   SubscriptionEndedCard
  //   UpgradePlanCard
  // *****************************
  cardHeading: { fontWeight: 700, marginBottom: theme.spacing(3) },
  reactivateAndUpgradeButton: {
    maxWidth: '250px',
    marginTop: theme.spacing(2),
  },
  subheading: {
    fontWeight: 300,
    width: '80%',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
  },
  subEndedAndUpgradePlanCardContainer: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    padding: theme.spacing(3, 5),
    margin: theme.spacing(0, 'auto'),
    width: '80%',
    maxWidth: '800px',
  },
}))

export default useCreateEventStyles
