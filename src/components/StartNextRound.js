import React, { useEffect, useContext, useState } from 'react'

import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import { useMutation } from 'react-apollo'

import { GameStateContext } from '../contexts/GameStateContext'
import { incrementRound } from '../gql/mutations'
import { findUsers, getAllRounds } from '../gql/queries'

const StartNextRound = ({ roundsData }) => {
  const { currentRound } = useContext(GameStateContext)

  const { loading, error, data } = useQuery(getAllRounds)
  const [incrementRoundMutation] = useMutation(incrementRound)

  const startRound = async () => {
    const thisRoundsPairings = roundsData.data.rounds.filter(
      (round) => round.round_number === currentRound + 1
    )
    const allPartnerXs = roundsData.data.rounds.reduce((all, item, index) => {
      all.push(item.partner_x)
      return all
    }, [])
    fetch('https://dry-crag-92103.herokuapp.com/create-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(allPartnerXs),
    }).then(() => {
      incrementRoundMutation()
    })
  }

  return (
    <Button variant="outlined" onClick={startRound}>
      Start Next Round
    </Button>
  )
}

export default StartNextRound
