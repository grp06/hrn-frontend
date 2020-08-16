import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Redirect, Link, useHistory } from 'react-router-dom'
import { Snack, FloatCardMedium } from '../../common'
import { sleep } from '../../helpers'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: '200px',
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
  linkRedirectToSignUp: {
    color: theme.palette.common.ghostWhite,
    fontFamily: 'Muli',
    textDecoration: 'none',
    marginTop: theme.spacing(2.5),
    '&:hover': {
      color: theme.palette.common.orchid,
    },
  },
  privacyPolicyText: {
    marginTop: theme.spacing(3),
  },
  privacyPolicyLink: {
    textDecoration: 'none',
    color: theme.palette.common.sunray,
  },
}))

const LoginForm = () => {
  const classes = useStyles()
  const history = useHistory()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showErrorSnack, setShowErrorSnack] = useState(false)
  const [showLoginSuccessSnack, setShowLoginSuccessSnack] = useState(false)

  const userIdInLocalStorage = localStorage.getItem('userId')
  // check to see if a user is already logged in, if so redirect
  if (userIdInLocalStorage && userIdInLocalStorage !== undefined) {
    return <Redirect to="/events" />
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    const loginResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        window.analytics.track('sign in')
        return data
      })
    // check to see if we have token, if not then theres an error
    // I tried try and catch, but it doesn't seem that we are throwing
    // an error from the backend
    if (!loginResponse.token) {
      setShowErrorSnack(true)
      return
    }

    setShowLoginSuccessSnack(true)
    await sleep(500)

    const { id, token } = loginResponse
    localStorage.setItem('token', token)

    localStorage.setItem('userId', id)
    const eventIdInLocalStorage = localStorage.getItem('eventId')

    if (eventIdInLocalStorage) {
      history.replace(`/events/${eventIdInLocalStorage}`)
      // FIXME
    }
    window.location.reload()
  }

  return (
    <div className={classes.wrapper}>
      <FloatCardMedium>
        <Grid item container direction="column" md={9} xs={12} className={classes.formContainer}>
          <form onSubmit={handleFormSubmit}>
            <Grid item container direction="column" alignItems="center">
              <Grid item>
                <Typography variant="h4" className={classes.formHeader}>
                  Welcome{' '}
                  <span role="img" aria-label="hand wave">
                    👋
                  </span>
                </Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" className={classes.inputContainer}>
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
                  label="Password"
                  type="password"
                  required
                  fullWidth
                  className={classes.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container direction="column" justify="center" alignItems="center">
              <Button
                disabled={showLoginSuccessSnack}
                color="primary"
                type="submit"
                variant="contained"
              >
                Log In
              </Button>
              <Link className={classes.linkRedirectToSignUp} to="/sign-up">
                Don&apos;t have an account?
              </Link>
              <Link className={classes.linkRedirectToSignUp} to="/forgot-password">
                Forgot Password?
              </Link>
              <Typography variant="subtitle2" className={classes.privacyPolicyText}>
                By logging into our app you acknoweldge that you have read and accept our{' '}
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
                open={showErrorSnack}
                onClose={() => setShowErrorSnack(false)}
                severity="error"
                snackMessage="Incorrect password or email"
              />
              <Snack
                open={showLoginSuccessSnack}
                onClose={() => setShowLoginSuccessSnack(false)}
                severity="success"
                snackMessage="Welcome Home 🏡"
              />
            </Grid>
          </form>
        </Grid>
      </FloatCardMedium>
    </div>
  )
}

export default LoginForm
