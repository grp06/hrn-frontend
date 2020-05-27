import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Mutation } from 'react-apollo'
import { Redirect } from 'react-router-dom'

import { Loading } from '.'
import loginPhoto from '../assets/login.svg'
import { useGameContext } from '../context/useGameContext'
import { createUser } from '../gql/mutations'

const useStyles = makeStyles(() => ({
  cardContainer: {
    display: 'flex',
    maxWidth: 600,
    margin: '0 auto',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '1em',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 200,
  },
  input: {
    marginBottom: '1em',
    marginTop: '1em',
  },
  onlineUsers: {
    width: 200,
    height: '100vh',
  },
}))

const LoginForm = ({ history }) => {
  const classes = useStyles()
  const { redirect, setRedirect } = useGameContext()

  const [username, setUsername] = useState('')

  useEffect(() => {
    setRedirect(false)
  }, [redirect])

  if (localStorage.getItem('userId')) {
    return <Redirect to="/events" push />
  }

  return (
    <Card className={classes.cardContainer}>
      <CardMedia className={classes.cover} image={loginPhoto} title="Live from space album cover" />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            Create a username:
          </Typography>
          <TextField
            id="username"
            placeholder="Johnny Appleseed"
            required
            fullWidth
            className={classes.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Mutation mutation={createUser}>
            {(createUserMutation, { data }) => (
              <Button
                secondary="true"
                variant="contained"
                onClick={async () => {
                  try {
                    const userdata = await createUserMutation({
                      variables: {
                        name: username,
                      },
                    })
                    localStorage.setItem('userId', userdata.data.insert_users.returning[0].id)
                    history.push('/events')
                  } catch (error) {
                    console.log(error)
                  }
                }}
              >
                Submit
              </Button>
            )}
          </Mutation>
        </CardContent>
      </div>
    </Card>
  )
}

export default LoginForm
