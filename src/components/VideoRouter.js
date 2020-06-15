import React from 'react'

import { useHistory } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'
import { ThumbsUp } from '../common'
import {
  PartnerDisconnected,
  PartnerCameraIssue,
  SittingOut,
  UserJoinedDuringRound,
  ConnectingToSomeone,
} from '../common/waitingRoomScreens'

const VideoRouter = ({ myRound }) => {
  const { user, event, twilio } = useAppContext()
  const { userId } = user
  const { partnerDisconnected, partnerNeverConnected, lateArrival } = twilio
  const { status, id } = event

  const history = useHistory()
  const displayVideoMessage = () => {
    const hasPartner = myRound ? myRound && myRound.partnerX_id && myRound.partnerY_id : null

    switch (status) {
      case 'not-started':
        return <ConnectingToSomeone />
      case 'in-between-rounds':
        return <ThumbsUp userId={userId} myRound={myRound} />
      case 'room-in-progress':
        if (lateArrival) {
          console.log('joined late')

          return <UserJoinedDuringRound />
        }
        if (partnerDisconnected && hasPartner) {
          console.log('partner disconnected')

          return <PartnerDisconnected />
        }
        if (myRound && !hasPartner) {
          console.log('sitting out')
          return <SittingOut />
        }
        if (partnerNeverConnected) {
          console.log('partner never connected')
          return <PartnerCameraIssue />
        }
        return null
      case 'complete':
        return history.push(`/events/${id}/event-complete`)

      default:
        return null
    }
  }

  return <div>{displayVideoMessage()}</div>
}
export default VideoRouter
