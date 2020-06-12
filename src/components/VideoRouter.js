import React, { useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'
import { ThumbsUp } from '../common'
import { listenToEvent } from '../gql/subscriptions'
import { PartnerDisconnected, PartnerCameraIssue, SittingOut } from '../common/waitingRoomScreens'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    background: '#111',
    height: '100vh',
    alignItems: 'center',
    flexDirection: 'column',
  },
}))

const VideoRouter = ({ myRound }) => {
  console.log(myRound)
  const classes = useStyles()
  const { user, event } = useAppContext()
  const { userId } = user
  const { status, current_round, id } = event
  const history = useHistory()
  const hasPartner = myRound && myRound.partnerX_id && myRound.partnerY_id

  let elementToRender
  const renderToUser = () => {
    console.log('eventStatus from VideoRouter =', status)
    switch (status) {
      case 'not-started':
        console.log('not-started was rendered')
        return null
      case 'in-between-rounds':
        console.log('in-between-rounds was rendered')
        return <div style={{ color: 'white' }}>ThumbsUp</div>
      // return <ThumbsUp myRound={myRound} userId={userId} />
      case 'room-in-progress':
        // waiting for partner. This only shows before the first round
        if (!myRound && current_round < 1) {
          console.log('room-in-progress was rendered')
          return <div>Connecting you to someone...</div>
        }
        // if (didPartnerDisconnect && hasPartner) {
        //   return <PartnerDisconnected />
        // }
        if (!hasPartner) {
          console.log('room-in-progress was rendered')
          return <SittingOut />
        }
        // if (partnerNeverConnected) {
        //   return <PartnerCameraIssue />
        // }
        break
      case 'complete':
        return history.push(`/events/${id}/event-complete`)

      default:
        return null
    }
  }
  useEffect(() => {
    elementToRender = renderToUser()
  }, [status])

  console.log('elementToRender ->', elementToRender)
  return <div className={classes.wrapper}>{elementToRender}</div>
}
export default VideoRouter
