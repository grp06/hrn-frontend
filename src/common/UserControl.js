import React, { useEffect } from 'react'

import { Redirect } from 'react-router-dom'

import { MainVideo } from '../components'
import RoomData from '../components/RoomData'
import { useGameContext } from '../context/useGameContext'
import endpointUrl from '../utils/endpointUrl'

const UserControl = () => {
  const { currentRound, userId, roundsData, setPartnerX, partnerX, setToken } = useGameContext()
  useEffect(() => {
    if (roundsData && roundsData.rounds && roundsData.rounds.length && currentRound) {
      const myRound = roundsData.rounds.find((round) => {
        const me =
          round.round_number === currentRound &&
          (round.partnerX_id === parseInt(userId, 10) || round.partnerY_id === parseInt(userId, 10))

        return me
      })

      setPartnerX(myRound.partnerX_id)
    }
  }, [currentRound, roundsData])

  useEffect(() => {
    if (partnerX) {
      fetch(`${endpointUrl}/api/token`, {
        method: 'POST',
        mode: 'no-cors', // no-cors, *cors, same-origin
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partnerX, myUserId: userId }),
      })
        .then((res) => res.json())
        .then(({ token }) => {
          setToken(token)
          fetch(`${endpointUrl}/api/rooms/${partnerX}`)
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

  if (currentRound === 0) {
    return <div>waiting for event to start</div>
  }

  return (
    <>
      <MainVideo />
    </>
  )
}

export default UserControl
