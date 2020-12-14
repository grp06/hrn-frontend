import React from 'react'
import { useTwilioContext } from '../../context'
import { PostChatRating, StartupFuelInBetweenRounds } from '.'
import { ConnectingToSomeone, PartnerDisconnected } from './waitingRoomScreens'

const VideoRouter = ({ eventId, eventStatus, myRound, setUserEventStatus }) => {
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
        if (eventId === 656) {
          return <StartupFuelInBetweenRounds />
        }
        return hasPartner ? (
          <PostChatRating myRound={myRound} setUserEventStatus={setUserEventStatus} />
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
