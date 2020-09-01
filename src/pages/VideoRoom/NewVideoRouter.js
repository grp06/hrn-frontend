import React from 'react'
import clsx from 'clsx'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

import { useEventContext, useUserContext } from '../../context'
import { Thumbing } from '.'
import {
  PartnerDisconnected,
  PartnerTechnicalIssue,
  SittingOut,
  ConnectingToSomeone,
  UserJoinedDuringRound,
} from './waitingRoomScreens'
import { useIsUserActive } from '../../hooks'

const useStyles = makeStyles((theme) => ({
  tagsOverlay: {
    position: 'fixed',
    bottom: theme.spacing(3),
    width: '100%',
    transition: '.6s',
    opacity: 0,
    '&.showControls, &:hover': {
      transition: 'opacity 0.6s',
      opacity: 1,
    },
  },
}))

const NewVideoRouter = ({ myRound }) => {
  const classes = useStyles()
  const { user } = useUserContext()
  const { event, twilio } = useEventContext()
  const { id: userId } = user
  const { partnerDisconnected, partnerNeverConnected, hasPartnerAndIsConnecting } = twilio
  const { status, round_length } = event
  const showControls = useIsUserActive()

  const displayVideoMessage = () => {
    const hasRoundsData = myRound !== 'no-assignment'
    const hasPartner = !hasRoundsData ? false : myRound.partner_id
    if (!hasRoundsData) {
      return <UserJoinedDuringRound />
    }

    if (hasRoundsData && !hasPartner) {
      return <SittingOut roundLength={round_length} />
    }

    switch (status) {
      case 'in-between-rounds':
        return hasPartner ? <Thumbing userId={userId} myRound={myRound} /> : <ConnectingToSomeone />
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
        return <Thumbing userId={userId} myRound={myRound} />
      default:
        return null
    }
  }

  return <div>{displayVideoMessage()}</div>
}
export default NewVideoRouter
