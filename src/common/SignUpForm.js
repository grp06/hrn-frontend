import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Link, Redirect, useHistory } from 'react-router-dom'

import { FloatCardMedium } from '.'
import { useAppContext } from '../context/useAppContext'

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
  linkRedirectToLogin: {
    color: theme.palette.common.rebeccaPurple,
    textDecoration: 'none',
    marginTop: '20px',
    '&:hover': {
      color: theme.palette.common.orchid,
    },
  },
}))

const SignUpForm = () => {
  const classes = useStyles()
  const history = useHistory()
  const { redirect, setRedirect, setUserId, userId } = useAppContext()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')

  useEffect(() => {
    setRedirect(false)
  }, [redirect])

  // check to see if a user is already logged in, if so redirect
  if (localStorage.getItem('userId')) {
    return <Redirect to="/events" />
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    const signUpResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ name, email, password, role }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data
      })

    const { token, id } = signUpResponse
    localStorage.setItem('userId', id)
    localStorage.setItem('token', token)
    setUserId(id)

    // check to see if we were redirected here by an event
    const eventIdInLocalStorage = localStorage.getItem('eventId')
    if (eventIdInLocalStorage) {
      history.replace(`/events/${eventIdInLocalStorage}`)
    }

    return <Redirect to="/events" />
  }

  return (
    <div className={classes.wrapper}>
      <FloatCardMedium>
        <Grid item container direction="column" className={classes.formContainer}>
          <form onSubmit={handleFormSubmit}>
            <Grid item container direction="column" alignItems="center">
              <Grid item>
                <Typography variant="h4" style={{ lineHeight: 1 }}>
                  Glad to have you join us! 🙌
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
                  label="Password"
                  type="password"
                  required
                  fullWidth
                  className={classes.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid container item direction="row" justify="center" alignItems="center">
                <RadioGroup
                  aria-label="gender"
                  name="gender1"
                  value={role}
                  onChange={(e) => {
                    // console.log(e.target.value)
                    setRole(e.target.value)
                  }}
                >
                  <FormControlLabel value="user" control={<Radio />} label="User" />
                  {/* <FormControlLabel value="host" control={<Radio />} label="Host" /> */}
                </RadioGroup>
              </Grid>
            </Grid>
            <Grid container direction="column" justify="center" alignItems="center">
              <Button color="primary" type="submit" variant="contained">
                Signup
              </Button>
              <Link className={classes.linkRedirectToLogin} to="/">
                Already have an account?
              </Link>
            </Grid>
          </form>
        </Grid>
      </FloatCardMedium>
    </div>
  )
}

export default SignUpForm
