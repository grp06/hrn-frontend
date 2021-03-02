import { makeStyles } from '@material-ui/styles'

const useOnboardingStyles = makeStyles((theme) => ({
  // *****************************
  //   Formik Onboarding Stepper
  // *****************************

  formContainer: {
    padding: theme.spacing(3),
  },
  backResetButton: {
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    marginRight: theme.spacing(1),
  },

  // *****************************
  //   Onboarding
  // *****************************
  onboardingContainer: {
    marginTop: '100px',
  },
  cityInputContainer: {
    padding: theme.spacing(0, 2.5),
  },
  shortBioInputContainer: {
    padding: theme.spacing(0, 2.5),
    marginBottom: theme.spacing(1),
  },
  // *****************************
  //   Onboarding Interest Tag Input
  // *****************************
  toggleTagActive: {
    '&.MuiChip-clickable:focus': {
      backgroundColor: theme.palette.common.basePurple,
    },
  },

  gridItemContainer: {
    marginBottom: theme.spacing(2.5),
  },
}))

export default useOnboardingStyles
