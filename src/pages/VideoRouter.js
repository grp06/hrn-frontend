import React from 'react'
import { useAppContext } from '../context/useAppContext'
import { ThumbsUp } from '../common'
import {
  PartnerDisconnected,
  PartnerTechnicalIssue,
  SittingOut,
  ConnectingToSomeone,
  PartnerPreview,
  UserJoinedDuringRound,
} from '../common/waitingRoomScreens'

const VideoRouter = ({ myRound }) => {
  const { user, event, twilio } = useAppContext()
  const { userId } = user
  const { partnerDisconnected, partnerNeverConnected, hasPartnerAndIsConnecting } = twilio
  const { status } = event

  const displayVideoMessage = () => {
    const hasRoundsData = myRound !== 'no-assignment'
    const hasPartner = !hasRoundsData ? false : myRound.partnerX_id && myRound.partnerY_id

    if (!hasRoundsData) {
      return <UserJoinedDuringRound />
    }

    if (hasRoundsData && !hasPartner) {
      return <SittingOut />
    }

    switch (status) {
      case 'partner-preview':
        return <PartnerPreview myRound={myRound} userId={userId} event={event} />
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
