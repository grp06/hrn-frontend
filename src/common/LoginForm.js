import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import MuiAlert from '@material-ui/lab/Alert'
import { Redirect, Link } from 'react-router-dom'

import { FloatCardMedium } from '.'
import { useGameContext } from '../context/useGameContext'
import { endpointUrl } from '../utils'

const Alert = (props) => {
  return <MuiAlert elevation={1} variant="filled" {...props} />
}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: '100px',
  },
  formContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: '40px',
    paddingBottom: '40px',
    width: '40vw',
  },
  inputContainer: {
    marginTop: '2em',
    marginBottom: '2em',
  },
  input: {
    marginBottom: '1em',
  },
  linkRedirectToSignUp: {
    color: theme.palette.common.rebeccaPurple,
    textDecoration: 'none',
    marginTop: '20px',
    '&:hover': {
      color: theme.palette.common.orchid,
    },
  },
}))

const LoginForm = () => {
  const classes = useStyles()
  const { redirect, setRedirect, setUserId } = useGameContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false)

  // useEffect(() => {
  //   setRedirect(false)
  // }, [redirect])

  const userIdInLocalStorage = localStorage.getItem('userId')
  // check to see if a user is already logged in, if so redirect
  if (userIdInLocalStorage && userIdInLocalStorage !== undefined) {
    return <Redirect to="/events" />
  }

  const handleErrorSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setErrorSnackbarOpen(false)
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    const loginResponse = await fetch(`${endpointUrl}/api/auth/login`, {
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
        return data
      })

    // check to see if we have token, if not then theres an error
    // I tried try and catch, but it doesn't seem that we are throwing
    // an error from the backend
    if (!loginResponse.token) {
      console.log('theres been an error')
      setErrorSnackbarOpen(true)
      return
    }
    const { role, id, token } = loginResponse
    localStorage.setItem('token', token)
    localStorage.setItem('userId', id)
    setUserId(id)

    return <Redirect to="/events" />
    // return history.push('/events')
  }

  return (
    <div className={classes.wrapper}>
      <FloatCardMedium>
        <Grid item container direction="column" className={classes.formContainer}>
          <form onSubmit={handleFormSubmit}>
            <Grid item container direction="column" alignItems="center">
              <Grid item>
                <Typography variant="h4" style={{ lineHeight: 1 }}>
                  Welcome Back! 🙌
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
              <Button color="primary" type="submit" variant="contained">
                Log In
              </Button>
              <Link className={classes.linkRedirectToSignUp} to="/sign-up">
                Don't have an account?
              </Link>
              <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={6000}
                onClose={handleErrorSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <Alert onClose={handleErrorSnackbarClose} severity="error">
                  Incorrect password or email
                </Alert>
              </Snackbar>
            </Grid>
          </form>
        </Grid>
      </FloatCardMedium>
    </div>
  )
}

export default LoginForm
