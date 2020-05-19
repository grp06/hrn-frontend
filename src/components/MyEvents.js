import React, { useEffect, Fragment } from 'react'

import { useSubscription, useQuery } from '@apollo/react-hooks'

import { AdminControl, UserControl } from '../common'
import { useGameContext } from '../context/useGameContext'
import { findMyUser } from '../gql/queries'
import { listenToRoundsData, getCurrentRound } from '../gql/subscriptions'
import { useSetUserId, useFindUserById } from '../hooks'

const MyEvents = () => {
  const { role, userId, setCurrentUserData, setCurrentRound, setRoundsData } = useGameContext()

  const { data: userData } = useQuery(findMyUser, {
    variables: { id: localStorage.getItem('userId') },
  })

  const { data: roundsData, loading: roundLoading, error } = useSubscription(listenToRoundsData, {
    variables: {
      eventId: 3,
    },
  })
  const {
    data: currentRoundData,
    loading: currentRoundLoading,
    error: currentRoundError,
  } = useSubscription(getCurrentRound, {
    variables: {
      eventId: 3,
    },
  })

  console.log(roundsData)

  const shouldDisplayShit = userData && userData.users
  // roundsData &&
  // roundsData.rounds

  useEffect(() => {
    if (shouldDisplayShit) {
      setCurrentUserData(userData.users[0])
      // setRoundsData(roundsData.rounds)
    }
  }, [userData, currentRoundData, roundsData])

  if (!userId) {
    return <div>no user id yet</div>
  }

  // setLoading(false)
  return <>{role ? <AdminControl /> : <UserControl />}</>
}

export default MyEvents
