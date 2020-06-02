import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { FloatCardMedium } from './'
import { endpointUrl } from '../utils'
import { useHistory, useLocation } from 'react-router-dom'

import loginPhoto from '../assets/login.svg'
import { useGameContext } from '../context/useGameContext'
import { createUser } from '../gql/mutations'

const useStyles = makeStyles(() => ({
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
}))

const SignUpForm = ({ location }) => {
  const classes = useStyles()
  const history = useHistory()
  const locationHook = useLocation()
  const { redirect, setRedirect, setUserId } = useGameContext()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')

  console.log('history', history)
  console.log('history location', history.location)
  console.log('location ->', location)
  console.log('location Hook ->', locationHook)

  useEffect(() => {
    setRedirect(false)
  }, [redirect])

  // if (localStorage.getItem('userId')) {
  //   return <Redirect to="/events" push />
  // }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    const signUpResponse = await fetch(`${endpointUrl}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ name: username, email, password, role }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data
      })

    const { token, id } = signUpResponse
    localStorage.setItem('userId', id)
    localStorage.setItem('token', token)
    setUserId(id)

    history.push('/events')
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
                  id="username"
                  label="Username"
                  required
                  fullWidth
                  className={classes.input}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                    console.log(e.target.value)
                    setRole(e.target.value)
                  }}
                >
                  <FormControlLabel value="user" control={<Radio />} label="User" />
                  <FormControlLabel value="host" control={<Radio />} label="Host" />
                </RadioGroup>
              </Grid>
            </Grid>
            <Grid container justify="center" alignItems="center">
              <Button color="primary" type="submit" variant="contained">
                Signup
              </Button>
            </Grid>
          </form>
        </Grid>
      </FloatCardMedium>
    </div>
  )
}

export default SignUpForm
