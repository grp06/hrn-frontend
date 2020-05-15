import React, { useEffect, useContext } from 'react'

import { useLazyQuery } from '@apollo/react-hooks'
import Card from '@material-ui/core/Card'

import { MainVideo } from '../components'
import { GameStateContext } from '../contexts/GameStateContext'
import { getMyRoundById } from '../gql/queries'

const endpoint = 'https://dry-crag-92103.herokuapp.com/'
const userId = parseInt(localStorage.getItem('userID'), 10)
const UserControl = () => {
  const { currentRound, setPartnerX } = useContext(GameStateContext)
  const [getRoundInfo, { data, loading, error }] = useLazyQuery(getMyRoundById, {
    variables: {
      id: userId,
      round_number: currentRound,
    },
  })

  useEffect(() => {
    if (currentRound !== 0) {
      getRoundInfo()
    }
  }, [currentRound, getRoundInfo])

  if (currentRound === 0) {
    return <div>Please wait for event to begin</div>
  }

  if (error) return <div>error</div>
  if (!data || loading) return <div>loading</div>
  if (!data.rounds.length) return <div>waiting for round data</div>

  const { id, partner_x, partner_y } = data.rounds[0]
  setPartnerX(partner_x)
  const myPartner = userId === partner_x ? partner_y : partner_x
  // get my room URL
  console.log('partner_x = ', partner_x)
  fetch(`https://dry-crag-92103.herokuapp.com/get-my-room/${partner_x}`)
    .then((apiData) => {
      return apiData.json()
    })
    .then((myRoomInfo) => {
      // console.log('myRoomInfo = ', myRoomInfo)
    })
    .catch((err) => console.log('err = ', err))

  return <MainVideo />
}

export default UserControl
