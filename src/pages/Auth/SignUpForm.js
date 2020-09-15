import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Link, Redirect, useHistory } from 'react-router-dom'

import { FloatCardMedium, Snack } from '../../common'
import { useAppContext } from '../../context/useAppContext'
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
  linkRedirectToLogin: {
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

const SignUpForm = () => {
  const classes = useStyles()
  const history = useHistory()
  const { redirect, setRedirect } = useAppContext()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [linkedInUrl, setLinkedInUrl] = useState('')
  const [showErrorSnack, setShowErrorSnack] = useState(false)
  const [showSignupSuccessSnack, setShowSignupSuccessSnack] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setRedirect(false)
  }, [redirect])

  // check to see if a user is already logged in, if so redirect
  if (localStorage.getItem('userId')) {
    return <Redirect to="/events" />
  }

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
        body: JSON.stringify({ name, email, password, linkedInUrl, role: 'user' }),
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
      linkedInUrl,
      role,
    })
    window.analytics.track('Sign up')
    localStorage.setItem('userId', id)
    localStorage.setItem('token', token)
    if (!!linkedInUrl) {
      localStorage.setItem('linkedInUrl', linkedInUrl)
    }

    history.push('/onboarding')
    window.location.reload()
  }

  return (
    <div className={classes.wrapper}>
      <FloatCardMedium>
        <Grid item container direction="column" sm={9} xs={12} className={classes.formContainer}>
          <form onSubmit={handleFormSubmit}>
            <Grid item container direction="column" alignItems="center">
              <Grid item>
                <Typography variant="h4" className={classes.formHeader}>
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
                  id="linkedInUrl"
                  label="LinkedIn URL"
                  fullWidth
                  className={classes.input}
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
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
    </div>
  )
}

export default SignUpForm
// (must contain 1 upper case, lower case, and special character)
