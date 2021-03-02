import { makeStyles } from '@material-ui/styles'

const useHostOnboardingStyles = makeStyles((theme) => ({
  // *****************************
  //   HostOnboardingForm
  // *****************************
  skipButton: {
    position: 'absolute',
    left: 'auto',
    right: '0%',
    bottom: 'auto',
    top: '0%',
    textTransform: 'none',
    color: theme.palette.common.ghostWhiteDark,
    fontWeight: 200,
  },
  // *****************************
  //   HostOnboardingStep
  // *****************************
  optionCard: {
    [theme.breakpoints.down('md')]: {
      width: '70%',
    },
    '&:hover': {
      backgroundColor: theme.palette.common.basePurple,
    },
    backgroundColor: theme.palette.common.grey10,
    borderRadius: '4px',
    color: theme.palette.common.ghostWhite,
    cursor: 'pointer',
    margin: theme.spacing(2),
    padding: theme.spacing(1),
    width: '45%',
  },
  optionsContainer: {
    margin: theme.spacing(4, 0),
  },
  selectedOptionCard: {
    backgroundColor: theme.palette.common.basePurple,
  },
  // *****************************
  //   ThankYouCard
  // *****************************
  letsGoButton: {
    marginTop: theme.spacing(2),
    maxWidth: '200px',
  },
  thankYouCardContainer: {
    backgroundColor: theme.palette.common.greyCard,
    height: 'auto',
    margin: theme.spacing(0, 'auto'),
    padding: theme.spacing(5),
    width: '50vw',
  },
  thankYouCardHeading: {
    fontWeight: 700,
    marginBottom: '32px',
  },
  thankYouCardSubheading: {
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
    fontWeight: 300,
    marginBottom: theme.spacing(2),
    width: '90%',
  },
}))

export default useHostOnboardingStyles
