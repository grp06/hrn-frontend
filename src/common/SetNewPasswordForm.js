import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Redirect, Link } from 'react-router-dom'

import { FloatCardMedium } from '.'
import { useAppContext } from '../context/useAppContext'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: '200px',
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
    color: theme.palette.common.ghostWhite,
    fontFamily: 'Muli',
    textDecoration: 'none',
    marginTop: '20px',
    '&:hover': {
      color: theme.palette.common.orchid,
    },
  },
}))

const SetNewPasswordForm = () => {
  const classes = useStyles()

  const [newPassword, setNewPassword] = useState('')
  const [repeatedPassword, setRepeatedPassword] = useState('')

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    const newPasswordSetResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/password_reset/receive_new_password/109/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwOSwiaWF0IjoxNTkzMDQ5ODAzLCJleHAiOjE1OTMwNTM0MDN9.svk99ccEkwc0GUMCY-HYAUDgw_zQWH6jA8no-0Wse48`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ password: newPassword }),
      }
    ).then((response) => response.json())
    console.log('newPasswordSetResponse = ', newPasswordSetResponse)
  }

  return (
    <div className={classes.wrapper}>
      <FloatCardMedium>
        <Grid item container direction="column" className={classes.formContainer}>
          <form onSubmit={handleFormSubmit}>
            <Grid item container direction="column" alignItems="center">
              <Grid item>
                <Typography variant="h4" style={{ lineHeight: 1 }}>
                  Reset Password
                </Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" className={classes.inputContainer}>
              <Grid item>
                <TextField
                  id="new-password"
                  label="New password"
                  required
                  fullWidth
                  className={classes.input}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="repeated-password"
                  label="Repeat new password"
                  required
                  fullWidth
                  className={classes.input}
                  value={repeatedPassword}
                  onChange={(e) => setRepeatedPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container direction="column" justify="center" alignItems="center">
              <Button color="primary" type="submit" variant="contained">
                Set New Password
              </Button>
            </Grid>
          </form>
        </Grid>
      </FloatCardMedium>
    </div>
  )
}

export default SetNewPasswordForm
