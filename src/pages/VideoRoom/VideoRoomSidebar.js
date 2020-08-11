import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import { HostEventControlsCard, RoundAndPartnerCard, PartnerTagsList } from '.'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    top: '5%',
    right: 'auto',
    bottom: 'auto',
    left: '0%',
    width: '250px',
  },
}))

const VideoRoomSidebar = ({ event, myRound, userId }) => {
  const classes = useStyles()
  const { host_id } = event
  return (
    <Grid container direction="column" className={classes.container}>
      {host_id === userId && <HostEventControlsCard event={event} />}
      <RoundAndPartnerCard event={event} myRound={myRound} userId={userId} />
      <PartnerTagsList myRound={myRound} userId={userId} />
    </Grid>
  )
}

export default VideoRoomSidebar
