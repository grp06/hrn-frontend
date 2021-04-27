// @ts-nocheck
import { makeStyles } from '@material-ui/styles'
import ConfettiDoodlesSmallerScale from '../../assets/ConfettiDoodlesSmallerScale.svg'

const useSubscriptionSignupStyles = makeStyles((theme) => ({
  // *****************************
  //   NewSignupForm
  // *****************************
  wrapper: {
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${ConfettiDoodlesSmallerScale})`,
  },
  formContainer: {
    margin: theme.spacing(0, 'auto'),
    padding: theme.spacing(5),
  },
  inputSpacing: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(0, 1),
  },
  formHeader: {
    textAlign: 'center',
  },
  inputContainer: {
    margin: theme.spacing(4, 0),
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  linkRedirectToLogin: {
    color: theme.palette.common.ghostWhite,
    fontFamily: 'Muli',
    textDecoration: 'none',
    marginTop: theme.spacing(2.5),
    '&:hover': {
      color: theme.palette.common.basePink,
    },
  },
  privacyPolicyText: {
    marginTop: theme.spacing(3),
    textAlign: 'center',
  },
  privacyPolicyLink: {
    textDecoration: 'none',
    color: theme.palette.common.sunray,
  },
}))

export default useSubscriptionSignupStyles
