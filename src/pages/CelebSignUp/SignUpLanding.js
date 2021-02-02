import React from 'react'
import { Button, Grid, Typography } from '@material-ui/core'
import ChitChatSignUpSmall from '../../assets/ChitChatSignUpSmall.png'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  buttonAndLinkContainer: {
    marginBottom: theme.spacing(6),
  },
  contentContainer: {
    height: '50vh',
    padding: theme.spacing(0, 2),
  },
  imageContainer: {
    backgroundImage: `url(${ChitChatSignUpSmall})`,
    backgroundSize: 'cover',
    height: '50vh',
    width: '100vw',
  },
  loginLink: {
    color: theme.palette.common.basePink,
    '&:hover': {
      color: theme.palette.common.ghostWhite,
    },
  },
  signUpButton: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  sloganTypography: {
    fontWeight: 700,
    fontSize: '2.5rem',
    marginBottom: theme.spacing(1),
  },
}))

export const SignUpLanding = ({ setShowSignUpForm }) => {
  const classes = useStyles()

  return (
    <Grid container direction="column" alignItems="flex-start" justify="center">
      <div className={classes.imageContainer} />
      <Grid
        container
        direction="column"
        className={classes.contentContainer}
        alignItems="center"
        justify="space-between"
      >
        <Grid container direction="column" alignItems="flex-end" justify="center">
          <Typography variant="h2" className={classes.sloganTypography}>
            <span style={{ color: '#8C57DB' }}>Meet</span>{' '}
            <span style={{ color: '#969BA3' }}>Right Now</span>
          </Typography>
          <Typography variant="h2" className={classes.sloganTypography}>
            <span style={{ color: '#fabb5b' }}>Chat</span> Right Now
          </Typography>
          <Typography variant="h2" className={classes.sloganTypography}>
            <span style={{ color: '#FF99AD' }}>Hi</span> Right Now
          </Typography>
        </Grid>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.buttonAndLinkContainer}
        >
          <Button
            variant="contained"
            size="large"
            color="primary"
            disableRipple
            className={classes.signUpButton}
            onClick={() => setShowSignUpForm(true)}
          >
            Sign up
          </Button>
          <Typography variant="subtitle1">
            Already have an account? <span className={classes.loginLink}>Log in</span>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
