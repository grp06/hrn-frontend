import React from 'react'
import { RoundAndPartnerCard } from '.'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'

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
  return (
    <Grid container direction="column" className={classes.container}>
      <RoundAndPartnerCard event={event} myRound={myRound} userId={userId} />
    </Grid>
  )
}

export default VideoRoomSidebar
