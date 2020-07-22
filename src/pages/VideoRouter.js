import React from 'react'

import { useAppContext } from '../context/useAppContext'
import { ThumbsUp } from '../common'
import {
  PartnerDisconnected,
  PartnerTechnicalIssue,
  SittingOut,
  UserJoinedDuringRound,
  ConnectingToSomeone,
  PartnerPreview,
} from '../common/waitingRoomScreens'

const VideoRouter = ({ myRound }) => {
  const { user, event, twilio } = useAppContext()
  const { userId } = user
  const { partnerDisconnected, partnerNeverConnected, lateArrival } = twilio
  const { status } = event

  const displayVideoMessage = () => {
    const hasPartner = myRound ? myRound && myRound.partnerX_id && myRound.partnerY_id : null

    switch (status) {
      case 'not-started':
        return <ConnectingToSomeone />
      case 'partner-preview':
        return <PartnerPreview myRound={myRound} userId={userId} />
      case 'in-between-rounds':
        return hasPartner ? <ThumbsUp userId={userId} myRound={myRound} /> : <ConnectingToSomeone />
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
          return <PartnerTechnicalIssue />
        }
        return null
      case 'complete':
        return <ThumbsUp userId={userId} myRound={myRound} />
      default:
        return null
    }
  }

  return <div>{displayVideoMessage()}</div>
}
export default VideoRouter
