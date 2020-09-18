import React from 'react'
import { useTwilioContext } from '../../context'
import { PostChatRating } from '.'
import { ConnectingToSomeone, PartnerDisconnected } from './waitingRoomScreens'

const VideoRouter = ({ eventStatus, myRound, userStatusBox }) => {
  const {
    partnerDisconnected,
    partnerNeverConnected,
    hasPartnerAndIsConnecting,
  } = useTwilioContext()

  const displayVideoMessage = () => {
    const hasRoundsData = myRound !== 'no-assignment'
    const hasPartner = !hasRoundsData ? false : myRound.partner_id
    switch (eventStatus) {
      case 'in-between-rounds':
        return hasPartner ? (
          <PostChatRating myRound={myRound} userStatusBox={userStatusBox} />
        ) : (
          <ConnectingToSomeone myRound={myRound} />
        )
      case 'room-in-progress':
        if (hasPartnerAndIsConnecting) {
          return (
            <ConnectingToSomeone partnerNeverConnected={partnerNeverConnected} myRound={myRound} />
          )
        }

        if (partnerDisconnected && hasPartner) {
          return <PartnerDisconnected myRound={myRound} />
        }
        return null
      case 'complete':
        return <PostChatRating myRound={myRound} />
      default:
        return null
    }
  }

  return <div>{displayVideoMessage()}</div>
}
export default VideoRouter
