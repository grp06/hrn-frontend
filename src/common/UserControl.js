import React, { useEffect, useContext } from 'react'

import { useQuery, useSubscription } from '@apollo/react-hooks'
import Card from '@material-ui/core/Card'
import { Redirect } from 'react-router-dom'

import { MainVideo } from '../components'
import { useGameContext } from '../context/useGameContext'
import { listenToRoundsData, getGameState } from '../gql/subscriptions'
import endpointUrl from '../utils/endpointUrl'

const UserControl = () => {
  const userId = localStorage.getItem('userID')
  const { setPartnerX, setAllRounds, setToken, token, partnerX } = useGameContext()
  const { loading, error, data } = useSubscription(listenToRoundsData)
  const gameState = useSubscription(getGameState)
  console.log('userId = ', userId)
  useEffect(() => {
    if (partnerX) {
      console.log('give me a token')
      fetch(`${endpointUrl}/give-me-a-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partnerX, myUserId: userId }),
      })
        .then((res) => res.json())
        .then(({ token }) => {
          setToken(token)
          fetch(`${endpointUrl}/get-my-room/${partnerX}`)
            .then((apiData) => {
              return apiData.json()
            })
            .then((myRoomInfo) => {
              console.log('myRoomInfo = ', myRoomInfo)
            })
            .catch((err) => console.log('err = ', err))
        })
    }
  }, [partnerX])

  if (loading || gameState.loading || gameState.error || error) return <p>Loading ...</p>
  if (!data) {
    return <div>no rounds data yet</div>
  }

  setAllRounds(data.rounds)
  if (data.rounds && !data.rounds.length) {
    if (!userId) {
      return <Redirect to="/" push />
    }
    return <div>waiting for event to start</div>
  }

  const { currentRound } = gameState.data.gameState[0]
  const myRound = data.rounds.find((round) => {
    const me =
      round.round_number === currentRound &&
      (round.partner_x === parseInt(userId, 10) || round.partner_y === parseInt(userId, 10))
    return me
  })

  if (!myRound) {
    return <div>no round data. so sad :(</div>
  }
  console.log('myRound.partner_x = ', myRound.partner_x)
  setPartnerX(myRound.partner_x)
  return <MainVideo />
}

export default UserControl
