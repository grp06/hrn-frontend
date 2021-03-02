import { makeStyles } from '@material-ui/styles'

const usePrivacyPolicyStyles = makeStyles((theme) => ({
  // *****************************
  // Privacy Policy
  // *****************************
  privacyPolicyContainer: {
    width: '80%',
    margin: theme.spacing(2, 'auto', 6, 'auto'),
  },
  sectionHeader: {
    marginTop: theme.spacing(2),
    color: theme.palette.common.ghostWhite,
  },
}))

export default usePrivacyPolicyStyles
