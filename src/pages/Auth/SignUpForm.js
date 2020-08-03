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
        body: JSON.stringify({ name, email, password, role: 'user' }),
      })
      // cant we just chain .json() to the above res?
      signUpResponse = await res.json()
      window.analytics.track('User Registered', {
        role: 'user',
      })
      if (signUpResponse.error) {
        setShowErrorSnack(true)
        throw signUpResponse.error
      }
    } catch (err) {
      console.log('err === ', err)
      return setError(err)
    }

    setShowSignupSuccessSnack(true)
    await sleep(800)

    const { token, id } = signUpResponse
    localStorage.setItem('userId', id)
    localStorage.setItem('token', token)

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
