import React from 'react'
import {
  CameLate,
  LeftChat,
  NoPartner,
  SittingOut,
  WaitingForMatch,
} from '../pages/Lobby/BroadcastBoxScreens'

const getBroadcastBoxElement = (userEventStatus) => {
  switch (userEventStatus) {
    case 'came late':
      return <CameLate />
    case 'left chat':
      return <LeftChat />
    case 'no partner':
      return <NoPartner />
    case 'sitting out':
      return <SittingOut />
    case 'waiting for match':
      return <WaitingForMatch />
    default:
      return null
  }
}

export default getBroadcastBoxElement
