import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import PersonIcon from '@material-ui/icons/Person'
import { makeStyles } from '@material-ui/styles'
import { useGetOnlineEventAttendees } from '../../hooks'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '80%',
    padding: theme.spacing(1),
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
  },
  lobbyAttendeesContainer: {
    height: '10%',
    margin: theme.spacing(0, 'auto'),
  },
  onlineAttendeesText: {
    color: theme.palette.common.sunray,
    marginLeft: theme.spacing(0.5),
  },
  totalAttendeesContainer: {
    width: 'auto',
    marginLeft: theme.spacing(1),
  },
  chatBox: {
    height: '88%',
  },
}))

const EventChatBox = React.memo(({ event }) => {
  const classes = useStyles()
  const onlineEventAttendees = useGetOnlineEventAttendees(event)
  return (
    <Grid container direction="column" justify="space-around" className={classes.container}>
      <Grid
        container
        wrap="nowrap"
        alignItems="center"
        justify="center"
        className={classes.lobbyAttendeesContainer}
      >
        <Avatar>
          <PersonIcon />
        </Avatar>
        <Grid container direction="row" className={classes.totalAttendeesContainer}>
          <Typography variant="body1" className={classes.onlineAttendeesText}>
            {onlineEventAttendees ? onlineEventAttendees.length : ' --'}
          </Typography>
          <Typography variant="body1" className={classes.onlineAttendeesText}>
            {' '}
            Attendees Online
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.chatBox}
      >
        <Typography variant="h6" style={{ textAlign: 'center' }}>
          Chat Coming Soon!{' '}
          <span role="img" aria-label="sunGlassSmileingFace">
            😎
          </span>
        </Typography>
      </Grid>
    </Grid>
  )
})

export default EventChatBox
