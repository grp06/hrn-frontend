import React from 'react'
import { NoPartner, SittingOut } from '../pages/VideoRoom/waitingRoomScreens'

const getBroadcastBoxElement = (userEventStatus) => {
  console.log('getBRoadcastBoxElement getting called')
  switch (userEventStatus) {
    case 'no partner':
      return <NoPartner />
    case 'sitting out':
      return <SittingOut />
    default:
      return null
  }
}

export default getBroadcastBoxElement
