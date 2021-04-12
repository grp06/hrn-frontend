import { makeStyles } from '@material-ui/styles'

const useCheckoutStyles = makeStyles((theme) => ({
  // *****************************
  //   CheckoutCard
  // *****************************
  checkoutPageContainer: {
    paddingTop: '100px',
    paddingBottom: '100px',
  },
  // *****************************
  //   CheckoutCard
  // *****************************
  checkoutCardContainer: {
    width: '50vw',
    margin: theme.spacing(0, 'auto'),
    borderRadius: '4px',
    [theme.breakpoints.down('sm')]: {
      width: '85vw',
    },
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
    padding: theme.spacing(3),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  checkoutFormInputMargin: {
    margin: theme.spacing(2, 0),
  },
  checkoutFormSection: {
    margin: theme.spacing(4, 0),
  },
  divider: {
    margin: theme.spacing(3, 0),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(2, 'auto'),
    },
  },
  sectionContainer: {
    marginBottom: theme.spacing(3),
    width: '100%',
  },
  sectionHeading: {
    fontWeight: 700,
    textAlign: 'center',
    width: '100%',
  },
  submitButtonContainer: {
    marginTop: theme.spacing(3),
  },
}))

export default useCheckoutStyles
