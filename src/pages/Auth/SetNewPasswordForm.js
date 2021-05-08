import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Link, useHistory } from 'react-router-dom'

import { FloatCardMedium } from '../../common'
import { constants } from '../../utils'
const { ROLE, TOKEN, USER_ID } = constants

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
  forgotPasswordWrapper: {
    marginTop: 25,
    textAlign: 'center',
  },
  forgotPasswordLink: {
    color: theme.palette.common.ghostWhite,
    fontFamily: 'Muli',
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.common.basePink,
    },
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: '1em',
    marginTop: '1em',
    color: theme.palette.common.red,
  },
}))

const SetNewPasswordForm = ({ match }) => {
  const classes = useStyles()
  const { userId, token } = match.params
  const history = useHistory()
  const [newPassword, setNewPassword] = useState('')
  const [repeatedPassword, setRepeatedPassword] = useState('')
  const [error, setError] = useState()
  const handleFormSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (newPassword !== repeatedPassword) {
      return setError('Passwords must match')
    }

    let newPasswordSetResponse
    try {
      newPasswordSetResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/email/set-new-password/${userId}/${token}`,
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

      if (newPasswordSetResponse.error) {
        throw newPasswordSetResponse.error
      }
    } catch (err) {
      if (err === 'Unauthorized request') {
        return setError(
          'Looks like there was an issue setting your new password. Please request a new password again.'
        )
      }
      return setError(err)
    }

    const { id, role, token: newPasswordToken } = newPasswordSetResponse

    localStorage.setItem(ROLE, role)
    localStorage.setItem(TOKEN, newPasswordToken)
    localStorage.setItem(USER_ID, id)
    history.push('/events')
    window.location.reload()
  }

  return (
    <div className={classes.wrapper}>
      <FloatCardMedium>
        <Grid item container direction="column" className={classes.formContainer}>
          <form onSubmit={handleFormSubmit}>
            <Grid item container direction="column" alignItems="center">
              <Grid item>
                <Typography variant="h1" style={{ lineHeight: 1 }}>
                  Set a new password
                </Typography>
              </Grid>
            </Grid>
            <Grid>
              <Typography className={classes.errorMessage} variant="body1">
                {error}
              </Typography>
            </Grid>
            <Grid item container direction="column" className={classes.inputContainer}>
              <Grid item>
                <TextField
                  id="new-password"
                  label="New password"
                  type="password"
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
                  type="password"
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
            <Grid className={classes.forgotPasswordWrapper}>
              <Link className={classes.forgotPasswordLink} to="/forgot-password">
                Forgot Password?
              </Link>
            </Grid>
          </form>
        </Grid>
      </FloatCardMedium>
    </div>
  )
}

export default SetNewPasswordForm
