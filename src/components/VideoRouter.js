import React, { useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'
import { ThumbsUp } from '../common'
import { listenToEvent } from '../gql/subscriptions'
import { PartnerDisconnected, PartnerCameraIssue, SittingOut } from '../common/waitingRoomScreens'
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
    const hasPartner = myRound && myRound.partnerX_id && myRound.partnerY_id

    switch (status) {
      case 'not-started':
        return null
      case 'in-between-rounds':
        return <ThumbsUp myRound={myRound} userId={userId} />
      case 'room-in-progress':
        // waiting for partner. This only shows before the first round
        if (current_round < 1) {
          return <div>Connecting you to someone...</div>
        }
        if (partnerDisconnected && hasPartner) {
          return <PartnerDisconnected />
        }

        if (!hasPartner) {
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
  }, [status, partnerNeverConnected, partnerDisconnected])

  return <div>{elementToRender}</div>
}
export default VideoRouter
