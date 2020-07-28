import React from 'react'
import clsx from 'clsx'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import { useAppContext } from '../context/useAppContext'
import { ThumbsUp, TagsList, ShowPartnerName } from '../common'
import {
  PartnerDisconnected,
  PartnerTechnicalIssue,
  SittingOut,
  ConnectingToSomeone,
  UserJoinedDuringRound,
} from '../common/waitingRoomScreens'
import { useIsUserActive } from '../hooks'

const useStyles = makeStyles((theme) => ({
  tagsOverlay: {
    position: 'fixed',
    bottom: theme.spacing(3),
    width: '100%',
    transition: '.6s',
    opacity: 0,
    '&.showControls, &:hover': {
      transition: 'opacity 0.6s',
      opacity: 1,
    },
  },
}))

const VideoRouter = ({ myRound }) => {
  const classes = useStyles()

  const { user, event, twilio } = useAppContext()
  const { userId } = user
  const { partnerDisconnected, partnerNeverConnected, hasPartnerAndIsConnecting } = twilio
  const { status } = event
  const showControls = useIsUserActive()

  const displayVideoMessage = () => {
    const hasRoundsData = myRound !== 'no-assignment'
    const hasPartner = !hasRoundsData ? false : myRound.partnerX_id && myRound.partnerY_id
    const remoteVideoDiv = document.getElementById('remote-video')
    const partnerVideoDiv = remoteVideoDiv && remoteVideoDiv.innerHTML
    if (!hasRoundsData) {
      return <UserJoinedDuringRound />
    }

    if (hasRoundsData && !hasPartner) {
      return <SittingOut />
    }

    switch (status) {
      case 'in-between-rounds':
        return hasPartner ? <ThumbsUp userId={userId} myRound={myRound} /> : <ConnectingToSomeone />
      case 'room-in-progress':
        if (hasPartnerAndIsConnecting) {
          return <ConnectingToSomeone />
        }

        if (partnerDisconnected && hasPartner) {
          return <PartnerDisconnected />
        }

        if (partnerNeverConnected) {
          return <PartnerTechnicalIssue />
        }

        return partnerVideoDiv ? (
          <Grid
            container
            alignItems="center"
            justify="center"
            className={`${clsx(classes.tagsOverlay, { showControls })}`}
          >
            <ShowPartnerName userId={userId} myRound={myRound} />
            <TagsList myRound={myRound} userId={userId} />
          </Grid>
        ) : null
      case 'complete':
        return <ThumbsUp userId={userId} myRound={myRound} />
      default:
        return null
    }
  }

  return <div>{displayVideoMessage()}</div>
}
export default VideoRouter
