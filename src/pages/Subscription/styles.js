import { makeStyles } from '@material-ui/styles'
import blurryBackground from '../../assets/blurryBackground.png'
import confettiDoodles from '../../assets/ConfettiDoodlesSmallerScale.svg'

const useSubscriptionStyles = makeStyles((theme) => ({
  // *****************************
  //   Enterprise Plan Card
  // *****************************
  enterprisePlanCardContainer: {
    borderRadius: '4px',
    backgroundColor: theme.palette.common.greyCard,
    width: '100%',
    margin: theme.spacing(2, 'auto'),
    padding: theme.spacing(3, 2),
    [theme.breakpoints.down('md')]: {
      width: '90%',
      margin: theme.spacing(2, 'auto'),
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: theme.spacing(2, 'auto'),
      padding: theme.spacing(2, 1.5),
    },
  },
  contactUsButton: {
    maxWidth: '200px',
    [theme.breakpoints.down('md')]: {
      minWidth: '50px',
      maxWidth: '150px',
      fontSize: '1rem',
      padding: theme.spacing(0.5, 1),
    },
  },
  planNameTypography: {
    fontWeight: 700,
    marginBottom: theme.spacing(0.25),
  },
  priceTypography: {
    fontWeight: 400,
    margin: theme.spacing(2, 0, 4, 0),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(0, 0, 1, 0),
      fontSize: '1.25rem',
    },
  },

  // *****************************
  //   get subscription checkout object
  // *****************************

  // *****************************
  //   pricing hero new
  // *****************************
  bannerGradient: {
    background:
      'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 50%, rgba(0,212,255,0) 100%)',
    height: 'auto',
    minHeight: '45vh',
    width: '100%',
    position: 'absolute',
    top: '0%',
    bottom: 'auto',
  },
  blurBackground: {
    width: '100%',
    height: 'auto',
    minHeight: '45vh',
    position: 'absolute',
    zIndex: '-3',
    backgroundPosition: '50% 50% !important',
    backgroundSize: 'cover !important',
    backgroundImage: `url(${blurryBackground})`,
  },
  contentPadding: {
    position: 'relative',
    zIndex: 9999,
    width: '80%',
    maxWidth: '1550px',
    height: '45vh',
    margin: theme.spacing(0, 'auto'),
  },
  heading: { fontWeight: 700, marginBottom: '32px' },
  joinBasicButton: { maxWidth: '200px' },
  pinkText: { color: '#FF99AD', fontWeight: '500' },
  subheading: {
    fontWeight: 300,
    width: '55%',
    marginBottom: '32px',
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
  },
  subheadingLessMargin: { fontWeight: 300, marginBottom: '16px' },
  // *****************************
  //   pricing plan card
  // *****************************
  activePlan: {
    // boxShadow: '0px 0px 4px 4px #8C57DB',
    border: '2px solid #8C57DB',
    boxShadow: '4px 4px 0 #8C57DB',
  },
  cardTopSection: {
    padding: theme.spacing(0, 3),
    [theme.breakpoints.down('md')]: {
      flexDirection: 'row',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1),
    },
  },

  getStartedButton: {
    maxWidth: '200px',
    [theme.breakpoints.down('md')]: {
      minWidth: '50px',
      maxWidth: '150px',
      fontSize: '1rem',
      padding: theme.spacing(0.5, 1),
    },
  },
  planHighlightsList: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(0, 0, 0, 3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1),
    },
  },
  planHighlightsSection: {
    padding: theme.spacing(0, 3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1),
    },
  },
  planHighlightTypography: {
    marginBottom: theme.spacing(0.5),
  },
  planNameContainer: {
    [theme.breakpoints.down('md')]: {
      width: '60%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },

  priceAndButtonContainer: {
    [theme.breakpoints.down('md')]: {
      alignItems: 'flex-end',
      width: '40%',
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
      alignItems: 'flex-start',
      width: '100%',
    },
  },
  pricingCardContainer: {
    borderRadius: '4px',
    backgroundColor: theme.palette.common.greyCard,
    width: '32%',
    margin: theme.spacing(2, 0),
    padding: theme.spacing(3, 2),
    [theme.breakpoints.down('md')]: {
      width: '90%',
      margin: theme.spacing(2, 'auto'),
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: theme.spacing(2, 'auto'),
      padding: theme.spacing(2, 1.5),
    },
  },

  // *****************************
  //   Subscription
  // *****************************

  divider: {
    width: '80vw',
    margin: theme.spacing(6, 'auto'),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(5, 'auto'),
    },
  },
  manageSubButton: {
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.common.basePink,
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(3),
    },
  },
  sectionHeading: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(3),
      textAlign: 'center',
    },
  },
  subButtonGridContainer: {
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  subscriptionContainer: {
    width: '80%',
    maxWidth: '1550px',
    margin: theme.spacing('75px', 'auto'),
  },
  pageContainer: {
    backgroundImage: `url(${confettiDoodles})`,
    backgroundSize: 'auto',
    backgroundRepeat: 'repeat',
    position: 'relative',
  },
}))

export default useSubscriptionStyles
