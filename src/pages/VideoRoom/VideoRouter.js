import React from 'react'
import { useEventContext } from '../../context'
import { PostChatRating } from '.'
import { ConnectingToSomeone, PartnerDisconnected } from './waitingRoomScreens'

const VideoRouter = ({ myRound }) => {
  console.log('myRound ->', myRound)
  const { event, twilio } = useEventContext()
  const { partnerDisconnected, partnerNeverConnected, hasPartnerAndIsConnecting } = twilio
  const { status } = event

  const displayVideoMessage = () => {
    const hasRoundsData = myRound !== 'no-assignment'
    const hasPartner = !hasRoundsData ? false : myRound.partner_id
    switch (status) {
      case 'in-between-rounds':
        return hasPartner ? (
          <PostChatRating myRound={myRound} />
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
