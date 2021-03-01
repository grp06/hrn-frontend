import { makeStyles } from '@material-ui/styles'

const useCheckoutSuccessStyles = makeStyles((theme) => ({
  // *****************************
  //   CongratsCard
  // *****************************
  congratsCardContainer: {
    height: 'auto',
    backgroundColor: theme.palette.common.greyCard,
    margin: theme.spacing(0, 'auto'),
    padding: theme.spacing(5),
    width: '70vw',
  },
  congratsHeading: { fontWeight: 700, marginBottom: '32px' },
  congratsSubheading: {
    fontWeight: 300,
    width: '80%',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
  },
  lottieContainer: {
    width: '100%',
    height: '300px',
    [theme.breakpoints.down('sm')]: {
      height: '200px',
    },
  },
  hostFormButton: { marginTop: theme.spacing(2), maxWidth: '200px' },
  textContainer: {
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(4),
    },
  },
  // *****************************
  //   PaymentConfirmationCard
  // *****************************
  paymentConfirmationCardContainer: {
    height: 'auto',
    margin: theme.spacing(0, 'auto'),
    padding: theme.spacing(3),
    width: '70vw',
    marginTop: '75px',
  },
  sectionMargin: {
    margin: theme.spacing(1, 0),
  },
  updatePaymentLink: {
    color: theme.palette.common.basePurple,
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}))

export default useCheckoutSuccessStyles
