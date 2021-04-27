// @ts-nocheck
import { makeStyles } from '@material-ui/styles'

const useSubscriptionSignupStyles = makeStyles((theme) => ({
  // *****************************
  //   NewSignupForm
  // *****************************
  formContainer: {
    width: '85%',
    height: 'auto',
    maxWidth: '1560px',
    margin: theme.spacing(0, 'auto', 0, 'auto'),
  },
  inputSpacing: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(0, 1),
  },
}))

export default useSubscriptionSignupStyles
