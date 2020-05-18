import React, { useEffect, useContext, useState } from 'react'

import { useQuery, useLazyQuery, useSubscription } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import { useMutation } from 'react-apollo'

import { useGameContext } from '../context/useGameContext'
import { incrementRound } from '../gql/mutations'
import { findUsers, getRoundsData } from '../gql/queries'
import { listenToRoundsData, getGameState } from '../gql/subscriptions'
import endpointUrl from '../utils/endpointUrl'

const StartNextRound = () => {
  const { loading, error, data } = useSubscription(listenToRoundsData)
  const [incrementRoundMutation] = useMutation(incrementRound)
  const { currentRound } = useGameContext()

  const startRound = async () => {
    // maybe this should be round + 1
    // because we only increment the round at the very end
    const currentRoundObj = data.rounds.filter((round) => round.round_number === currentRound + 1)
    debugger
    if (currentRoundObj.length > 0) {
      const allPartnerXs = currentRoundObj.reduce((all, item, index) => {
        all.push(item.partnerX_id)
        return all
      }, [])
      console.log('allparnerx = ', allPartnerXs)
      fetch(`${endpointUrl}/create-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allPartnerXs),
      }).then(() => {
        incrementRoundMutation()
      })
    } else {
      // we should do nothing here
      // or set game to be over
    }
  }

  return (
    <Button variant="outlined" onClick={startRound}>
      Start Next Round
    </Button>
  )
}

export default StartNextRound
