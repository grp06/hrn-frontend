import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import {
  HostEventControlsCard,
  MoreActionsButton,
  PartnerTagsList,
  RoundAndPartnerCard,
  AddFriendButton,
} from '.'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    top: '3%',
    right: 'auto',
    bottom: 'auto',
    left: '1%',
    width: '250px',
    zIndex: 9999,
  },
  shareMyInfoContainer: {
    position: 'absolute',
    top: 'auto',
    right: 'auto',
    bottom: '0.5%',
    left: '1%',
    width: '250px',
    zIndex: 99,
  },
}))

const VideoRoomSidebar = ({ event, myRound, userId }) => {
  const classes = useStyles()
  const { host_id } = event
  return (
    <>
      <Grid container direction="column" className={classes.container}>
        {host_id === userId && <HostEventControlsCard event={event} userId={userId} />}
        <RoundAndPartnerCard
          event={event}
          myRound={myRound}
          addFriendButton={<AddFriendButton myRound={myRound} />}
        />
        <PartnerTagsList myRound={myRound} userId={userId} />
      </Grid>
      <Grid container justify="center" alignItems="center" className={classes.shareMyInfoContainer}>
        <MoreActionsButton myRound={myRound} />
      </Grid>
    </>
  )
}

export default VideoRoomSidebar
