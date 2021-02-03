import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { constants } from '../../utils'
import { FloatCardMedium, Snack } from '../../common'
import { useAppContext } from '../../context'
import confettiDoodles from '../../assets/confettiDoodles.svg'
import { sleep, signupUserNew } from '../../helpers'

const { USER_ID, TOKEN, ROLE } = constants

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    position: 'relative',
    bottom: '0%',
    display: 'block',
    width: '50vw',
    height: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
    borderRadius: '4px',
    backgroundColor: theme.palette.common.greyCard,
    [theme.breakpoints.down('xs')]: {
      width: '95vw',
    },
  },
  wrapper: {
    width: '100vw',
    minHeight: '100vh',
    padding: theme.spacing(2, 0),
    backgroundImage: `url(${confettiDoodles})`,
  },
  formContainer: {
    margin: theme.spacing(0, 'auto'),
    padding: theme.spacing(5),
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
  recievePaymentsTypography: {
    margin: theme.spacing(1, 0, 3, 0),
    color: theme.palette.common.ghostWhite,
  },
}))

const CelebSignUpForm = () => {
  const classes = useStyles()
  const history = useHistory()
  const { redirect, setRedirect } = useAppContext()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [venmo, setVenmo] = useState('')
  const [cashApp, setCashApp] = useState('')
  const [showSignupSuccessSnack, setShowSignupSuccessSnack] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setRedirect(false)
  }, [redirect])

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    if (!cashApp && !venmo) {
      setError('You have to provide either your Cash App or Venmo username')
      return
    }
    let signupResponse
    try {
      signupResponse = await signupUserNew({
        role: 'celeb',
        userInfo: { cash_app: cashApp, email, name, password, venmo },
      })

      if (signupResponse.error) {
        setError(signupResponse.error)
        throw signupResponse.error
      }
    } catch (err) {
      console.log('err === ', err)
      return setError(err)
    }

    setShowSignupSuccessSnack(true)

    await sleep(800)

    const { token, id, role } = signupResponse
    window.analytics.identify(id, {
      name,
      email,
      role,
    })

    window.analytics.track('Sign up new')
    localStorage.setItem(USER_ID, id)
    localStorage.setItem(ROLE, role)
    localStorage.setItem(TOKEN, token)
    // TODO: decide where to send new user
    history.push('/creator-home')
    window.location.reload()
  }

  return (
    <Grid container justify="center" alignItems="center" className={classes.wrapper}>
      <Grid container direction="column" className={classes.cardContainer}>
        <Grid item container direction="column" sm={9} xs={12} className={classes.formContainer}>
          <form onSubmit={handleFormSubmit}>
            <Grid item container direction="column" alignItems="center">
              <Grid item>
                <Typography variant="h2" className={classes.formHeader}>
                  Welcome!{' '}
                  <span role="img" aria-label="hands up">
                    🙌
                  </span>
                </Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" className={classes.inputContainer}>
              <Grid item>
                <TextField
                  id="name"
                  label="Full Name"
                  required
                  fullWidth
                  className={classes.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="email"
                  label="Email"
                  required
                  fullWidth
                  className={classes.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="password"
                  label="Password (8 chars min)"
                  type="password"
                  required
                  fullWidth
                  className={classes.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Divider />
              <Typography variant="subtitle2" className={classes.recievePaymentsTypography}>
                How would you like to receive payments?
                <span aria-hidden="true" class="MuiFormLabel-asterisk MuiInputLabel-asterisk">
                   *
                </span>
              </Typography>
              <Grid item>
                <TextField
                  label="Venmo Username"
                  fullWidth
                  className={classes.input}
                  value={venmo}
                  onChange={(e) => setVenmo(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Cash App Username"
                  fullWidth
                  className={classes.input}
                  value={cashApp}
                  onChange={(e) => setCashApp(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container direction="column" justify="center" alignItems="center">
              <Button
                disabled={showSignupSuccessSnack}
                color="primary"
                type="submit"
                variant="contained"
              >
                Signup
              </Button>
              <Link className={classes.linkRedirectToLogin} to="/login-new">
                Already have an account?
              </Link>
              <Typography variant="subtitle2" className={classes.privacyPolicyText}>
                By creating an account on our app you acknoweldge that you have read and accept our{' '}
                <Link
                  to="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.privacyPolicyLink}
                >
                  privacy policy
                </Link>
              </Typography>
              <Snack
                open={Boolean(error)}
                onClose={() => setError('')}
                severity="error"
                snackMessage={error}
              />
              <Snack
                open={showSignupSuccessSnack}
                onClose={() => setShowSignupSuccessSnack(false)}
                severity="success"
                snackMessage="Unlocking the doors 🚪"
              />
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CelebSignUpForm
// (must contain 1 upper case, lower case, and special character)
