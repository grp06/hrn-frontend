import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { StartEventButton } from '.'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    top: '2%',
    right: 'auto',
    bottom: 'auto',
    left: '0%',
    width: '250px',
    height: 'auto',
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
    padding: theme.spacing(1),
  },
  onlineUsersText: {
    color: theme.palette.common.sunray,
    textAlign: 'center',
    marginBottom: theme.spacing(1),
  },
  welcomeRemarks: {
    textAlign: 'center',
  },
}))

const PreEventControlsCard = ({ event, user }) => {
  const classes = useStyles()
  const { userId } = user
  const { host_id, event_users } = event
  const isEventHost = host_id === userId

  const numberOfOnlineUsers = () => {
    return (
      event_users.length && (
        <Typography variant="subtitle1" className={classes.onlineUsersText}>
          Online Users: {event_users.length}
        </Typography>
      )
    )
  }

  const renderCardContent = () => {
    return isEventHost ? (
      <StartEventButton event={event} user={user} />
    ) : (
      <Typography variant="body1" className={classes.welcomeRemarks}>
        Welcome remarks from the host
      </Typography>
    )
  }

  return (
    <Grid
      container
      direction="column"
      justify="stretch"
      alignItems="center"
      className={classes.container}
    >
      {renderCardContent()}
    </Grid>
  )
}

export default PreEventControlsCard
