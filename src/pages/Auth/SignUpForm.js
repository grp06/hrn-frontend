import React, { useState, useEffect } from 'react'

import { Button, Grid, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Link, useHistory } from 'react-router-dom'

import { FloatCardMedium, Snack } from '../../common'
import { useAppContext } from '../../context'
import confettiDoodles from '../../assets/confettiDoodles.svg'
import { sleep } from '../../helpers'
import { constants } from '../../utils'
const { ROLE, TOKEN, USER_ID } = constants

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100vw',
    height: '100vh',
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
}))

const SignUpForm = () => {
  const classes = useStyles()
  const history = useHistory()
  const { redirect, setRedirect } = useAppContext()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showErrorSnack, setShowErrorSnack] = useState(false)
  const [showSignupSuccessSnack, setShowSignupSuccessSnack] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setRedirect(false)
  }, [redirect])

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    // setError(false)

    let signUpResponse
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ name, email, password, role: 'user' }),
      })
      // cant we just chain .json() to the above res?
      signUpResponse = await res.json()

      if (signUpResponse.error) {
        setShowErrorSnack(true)
        throw signUpResponse.error
      }
    } catch (err) {
      console.log('err === ', err)
      return setError(err)
    }

    setShowSignupSuccessSnack(true)
    console.log('before')
    await sleep(800)
    console.log('after')
    const { token, id, role } = signUpResponse
    window.analytics.identify(id, {
      name,
      email,
      role,
    })
    window.analytics.track('Sign up')
    localStorage.setItem(ROLE, role)
    localStorage.setItem(TOKEN, token)
    localStorage.setItem(USER_ID, id)
    const subscriptionCheckoutObject = localStorage.getItem('subscriptionCheckoutObject')

    if (subscriptionCheckoutObject) {
      history.push('/checkout', JSON.parse(subscriptionCheckoutObject))
      return window.location.reload()
    }

    history.push('/onboarding')
    window.location.reload()
  }

  return (
    <Grid container justidy="center" alignItems="center" className={classes.wrapper}>
      <FloatCardMedium>
        <Grid item container direction="column" sm={9} xs={12} className={classes.formContainer}>
          <form onSubmit={handleFormSubmit}>
            <Grid item container direction="column" alignItems="center">
              <Grid item>
                <Typography variant="h2" className={classes.formHeader}>
                  Glad to have you join us!{' '}
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
                  label="Name"
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
              <Link className={classes.linkRedirectToLogin} to="/">
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
                open={showErrorSnack}
                onClose={() => setShowErrorSnack(false)}
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
      </FloatCardMedium>
    </Grid>
  )
}

export default SignUpForm
// (must contain 1 upper case, lower case, and special character)
