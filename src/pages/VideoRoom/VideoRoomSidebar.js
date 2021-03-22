import React from 'react'
import { Grid } from '@material-ui/core'

import {
  HostEventControlsCard,
  PartnerTagsList,
  RoundAndPartnerCard,
  AddFriendButton,
  useVideoRoomStyles,
  IcebreakerQuestionCard,
} from '.'

const VideoRoomSidebar = ({ event, myRound, myTagsArray, userId }) => {
  const classes = useVideoRoomStyles()
  const { host_id } = event
  return (
    <>
      <Grid container direction="column" className={classes.videoRoomSidebarContainer}>
        {host_id === userId && <HostEventControlsCard event={event} userId={userId} />}
        <RoundAndPartnerCard
          event={event}
          myRound={myRound}
          addFriendButton={<AddFriendButton myRound={myRound} />}
        />
        <IcebreakerQuestionCard />
        <PartnerTagsList myRound={myRound} myTagsArray={myTagsArray} />
      </Grid>
    </>
  )
}

export default VideoRoomSidebar
