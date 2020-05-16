import React, { useEffect, useContext } from 'react'

import { useQuery } from '@apollo/react-hooks'
import Card from '@material-ui/core/Card'

import { MainVideo } from '../components'
import { useGameContext } from '../context/useGameContext'
import { getAllRounds } from '../gql/queries'
import endpointUrl from '../utils/endpointUrl'

const UserControl = () => {
  const { userId, currentRound, setPartnerX, allRounds, setAllRounds } = useGameContext()
  const { loading, error, data } = useQuery(getAllRounds)

  if (loading || error) return <p>Loading ...</p>
  if (!data) {
    return <div>no rounds data yet</div>
  }
  console.log('data.rounds = ', data.rounds)
  setAllRounds(data.rounds)
  const myRound = data.rounds.find((round) => {
    const me =
      round.round_number === currentRound &&
      (round.partner_x === userId || round.partner_y === userId)

    return me
  })

  console.log('myRound = ', myRound)

  // fetch(`${endpointUrl}/get-my-room/${partner_x}`)
  //   .then((apiData) => {
  //     return apiData.json()
  //   })
  //   .then((myRoomInfo) => {
  //     // console.log('myRoomInfo = ', myRoomInfo)
  //   })
  //   .catch((err) => console.log('err = ', err))

  return <MainVideo />
}

export default UserControl
