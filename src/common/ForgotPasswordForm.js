import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'

import { FloatCardMedium } from '.'

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
  successMessage: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
}))

const ForgotPasswordForm = () => {
  const classes = useStyles()

  const [email, setEmail] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const handleFormSubmit = async (event) => {
    event.preventDefault()
    await fetch(`${process.env.REACT_APP_API_URL}/api/email/reset_password/user/${email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        Accept: 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    setSuccessMessage(
      "If we found an account associated with that email address, we've sent along the password reset instructions."
    )
  }

  return (
    <div className={classes.wrapper}>
      <FloatCardMedium>
        <Grid item container direction="column" md={9} xs={12} className={classes.formContainer}>
          <form onSubmit={handleFormSubmit}>
            <Grid item container direction="column" alignItems="center">
              <Grid item>
                <Typography variant="h4" className={classes.formHeader}>
                  Reset Password
                </Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" className={classes.inputContainer}>
              <Grid item>
                <TextField
                  id="email"
                  label="Email you signed up with"
                  required
                  fullWidth
                  className={classes.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid>
              <Typography className={classes.successMessage} variant="body1">
                {successMessage}
              </Typography>
            </Grid>
            <Grid container direction="column" justify="center" alignItems="center">
              <Button color="primary" type="submit" variant="contained">
                Reset Password
              </Button>
              <Link className={classes.linkRedirectToSignUp} to="/">
                Sign In
              </Link>
              <Link className={classes.linkRedirectToSignUp} to="/sign-up">
                Create account
              </Link>
            </Grid>
          </form>
        </Grid>
      </FloatCardMedium>
    </div>
  )
}

export default ForgotPasswordForm
