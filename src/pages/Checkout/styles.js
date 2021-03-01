import { makeStyles } from '@material-ui/styles'
import blurryBackground from '../../assets/blurryBackground.png'

const useCheckoutStyles = makeStyles((theme) => ({
  // *****************************
  //   CheckoutCard
  // *****************************
  checkoutCardContainer: {
    width: '70vw',
    margin: theme.spacing(0, 'auto'),
    backgroundColor: theme.palette.common.grey10,
    borderRadius: '4px',
  },
  divider: {
    margin: theme.spacing(3, 0),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      width: '75%',
      margin: theme.spacing(2, 'auto'),
    },
  },
  pinkCostText: {
    marginTop: theme.spacing(1),
    color: theme.palette.common.basePink,
    fontSize: '1.7rem',
  },
  planHighlightTypography: {
    marginBottom: theme.spacing(0.5),
  },
  planNameContainer: {
    width: '100%',
    height: '25%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      alignItems: 'center',
      borderRadius: '4px',
      padding: theme.spacing(3),
    },
  },
  showPlanDetailsButton: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  spanSubtitle: {
    fontFamily: 'Muli',
    color: theme.palette.common.greySubtitle,
    fontWeight: '300',
  },
  // *****************************
  //   CheckoutForm
  // *****************************
  cardElementContainer: {
    backgroundColor: theme.palette.common.grey10,
    color: theme.palette.common.ghostWhite,
    padding: theme.spacing(1.5),
    borderRadius: '4px',
    margin: theme.spacing(2, 0),
  },
  checkoutFormContainer: {
    height: 'auto',
    backgroundColor: theme.palette.common.greyCard,
    padding: theme.spacing(3),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  checkoutFormInputMargin: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(0, 1),
  },
  checkoutFormSection: {
    margin: theme.spacing(4, 0),
    padding: theme.spacing(0, 1),
  },
  sectionContainer: {
    marginBottom: theme.spacing(3),
    width: '100%',
  },
  subtitleHeading: {
    color: theme.palette.common.ghostWhiteDark,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
}))

export default useCheckoutStyles
