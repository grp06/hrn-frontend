import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'
import { useAppContext, useUserContext } from '../../context'
import logo from '../../assets/logoWhite.svg'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    marginTop: theme.spacing(10),
    position: 'relative',
    height: `calc(100vh - ${theme.spacing(10)}px)`,
  },
  logo: {
    width: '62px',
    height: '62px',
  },
  creatorSignUpTitle: {
    margin: theme.spacing(2, 0, 12, 0),
  },
  clickBelowSubtitle: {
    marginTop: theme.spacing(1),
  },
  createEventButton: {
    position: 'absolute',
    bottom: theme.spacing(2),
    margin: '0 auto',
  },
}))

const CreatorHome = () => {
  const classes = useStyles()
  const { user } = useUserContext()
  const history = useHistory()

  useEffect(() => {
    window.analytics.page('/creator-home')
  }, [])

  const renderHello = () => {
    return user && user.name ? `Hi, ${user.name.split(' ')[0]} 👋` : ''
  }

  return (
    <Grid container className={classes.pageContainer} alignItems="center" direction="column">
      <img alt="company-logo" className={classes.logo} src={user.profile_pic_url || logo} />

      <Typography variant="h4" className={classes.creatorSignUpTitle}>
        {renderHello()}
      </Typography>
      <Typography variant="h3">Thanks for signing up!</Typography>
      <Typography variant="subtitle1" className={classes.clickBelowSubtitle}>
        Click below to create your first event.
      </Typography>
      <Button
        color="primary"
        type="submit"
        variant="contained"
        className={classes.createEventButton}
        onClick={() => history.push('/create-chit-chat')}
      >
        Create Event
      </Button>
    </Grid>
  )
}

export default CreatorHome
