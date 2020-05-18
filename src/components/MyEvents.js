import React, { useEffect, Fragment } from 'react'

import { useSubscription, useQuery } from '@apollo/react-hooks'

import { AdminControl, UserControl } from '../common'
import { useGameContext } from '../context/useGameContext'
import { findMyUser } from '../gql/queries'
import { listenToRoundsData, getCurrentRound } from '../gql/subscriptions'
import { useSetUserId, useFindUserById } from '../hooks'

const MyEvents = () => {
  const { isAdmin, userId, setCurrentUserData, setCurrentRound, setRoundsData } = useGameContext()

  const { data: userData } = useQuery(findMyUser, {
    variables: { id: localStorage.getItem('userId') },
  })

  const { data: roundsData, loading: roundLoading, error } = useSubscription(listenToRoundsData)
  const {
    data: currentRoundData,
    loading: currentRoundLoading,
    error: currentRoundError,
  } = useSubscription(getCurrentRound)

  console.log(roundsData)

  const shouldDisplayShit =
    userData && userData.users && currentRoundData && currentRoundData.gameState
  // roundsData &&
  // roundsData.rounds

  useEffect(() => {
    if (shouldDisplayShit) {
      debugger
      setCurrentUserData(userData.users[0])
      setCurrentRound(currentRoundData.gameState[0].currentRound)
      // setRoundsData(roundsData.rounds)
    }
  }, [userData, currentRoundData, roundsData])

  if (!userId) {
    return <div>no user id yet</div>
  }

  // setLoading(false)
  return <>{isAdmin ? <AdminControl /> : <UserControl />}</>
}

export default MyEvents
