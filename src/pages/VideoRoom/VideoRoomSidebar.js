import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import { HostEventControlsCard, RoundAndPartnerCard, PartnerTagsList, ShareMyInfoButton } from '.'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    top: '5%',
    right: 'auto',
    bottom: 'auto',
    left: '1%',
    width: '250px',
    zIndex: 9999,
  },
}))

const VideoRoomSidebar = ({ event, myRound, userId }) => {
  const classes = useStyles()
  const { host_id } = event
  console.log(myRound)
  return (
    <Grid container direction="column" className={classes.container}>
      {host_id === userId && <HostEventControlsCard event={event} userId={userId} />}
      <RoundAndPartnerCard event={event} myRound={myRound} userId={userId} />
      <PartnerTagsList myRound={myRound} userId={userId} />
      <ShareMyInfoButton myRound={myRound} />
    </Grid>
  )
}

export default VideoRoomSidebar
