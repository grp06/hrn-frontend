import React from 'react'
import { CameLate, LeftChat, NoPartner, SittingOut } from '../pages/VideoRoom/waitingRoomScreens'

const getBroadcastBoxElement = (userEventStatus) => {
  console.log('getBRoadcastBoxElement getting called')
  switch (userEventStatus) {
    case 'came late':
      return <CameLate />
    case 'left chat':
      return <LeftChat />
    case 'no partner':
      return <NoPartner />
    case 'sitting out':
      return <SittingOut />
    default:
      return null
  }
}

export default getBroadcastBoxElement
