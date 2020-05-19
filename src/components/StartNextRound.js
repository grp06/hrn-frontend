import React, { useEffect, useContext, useState } from 'react'

import { useQuery, useLazyQuery, useSubscription } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import { useMutation } from 'react-apollo'

import { useGameContext } from '../context/useGameContext'
import { incrementRound } from '../gql/mutations'
import startRound from '../helpers/startRound'

const StartNextRound = () => {
  const [incrementRoundMutation] = useMutation(incrementRound)
  const { currentRound, roundsData } = useGameContext()

  const onClickHandler = () => {
    startRound(roundsData.rounds, currentRound).then(incrementRoundMutation)
  }

  return (
    <Button variant="outlined" onClick={() => onClickHandler()}>
      Start Next Round
    </Button>
  )
}

export default StartNextRound
