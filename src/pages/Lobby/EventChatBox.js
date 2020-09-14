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
    width: '100%',
    height: '10%',
  },
  onlineAttendeesText: {
    color: theme.palette.common.sunray,
  },
  totalAttendeesContainer: {
    width: 'auto',
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
        justify="space-around"
        className={classes.lobbyAttendeesContainer}
      >
        <Avatar>
          <PersonIcon />
        </Avatar>
        <Grid container direction="column" className={classes.totalAttendeesContainer}>
          <Grid container>
            <Typography variant="body1" className={classes.onlineAttendeesText}>
              {onlineEventAttendees ? onlineEventAttendees.length : ' --'}
            </Typography>
            <Typography variant="body1" className={classes.onlineAttendeesText}>
              {' '}
              Atendees Online
            </Typography>
          </Grid>
          {/* <Grid container>
            <Typography variant="body1">0</Typography>
            <Typography variant="body1">Atendees in Chatting</Typography>
          </Grid> */}
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
        <Typography variant="h6">
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
