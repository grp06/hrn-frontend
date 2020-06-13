import React, { useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'
import { ThumbsUp } from '../common'
import { listenToEvent } from '../gql/subscriptions'
import {
  PartnerDisconnected,
  PartnerCameraIssue,
  SittingOut,
  UserJoinedDuringRound,
  ConnectingToSomeone,
} from '../common/waitingRoomScreens'
import { useTwilio } from '../hooks'

const useStyles = makeStyles((theme) => ({}))
let elementToRender

const VideoRouter = ({ myRound, partnerNeverConnected, partnerDisconnected }) => {
  const classes = useStyles()
  const { user, event } = useAppContext()
  const { userId } = user
  const { status, current_round, id } = event
  const history = useHistory()

  const displayVideoMessage = () => {
    const hasPartner = myRound ? myRound && myRound.partnerX_id && myRound.partnerY_id : null
    switch (status) {
      case 'not-started':
        return <ConnectingToSomeone />
      case 'in-between-rounds':
        return hasPartner ? <ThumbsUp myRound={myRound} userId={userId} /> : <ConnectingToSomeone />
      case 'room-in-progress':
        if (!myRound && current_round > 0) {
          return <UserJoinedDuringRound />
        }
        if (partnerDisconnected && hasPartner) {
          return <PartnerDisconnected />
        }
        if (myRound && !hasPartner) {
          return <SittingOut />
        }
        if (partnerNeverConnected) {
          return <PartnerCameraIssue />
        }
        return null
      case 'complete':
        return history.push(`/events/${id}/event-complete`)

      default:
        return null
    }
  }
  useEffect(() => {
    elementToRender = displayVideoMessage()
  }, [status, partnerNeverConnected, partnerDisconnected, myRound])

  return <div>{elementToRender}</div>
}
export default VideoRouter
