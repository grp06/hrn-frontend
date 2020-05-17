import React, { useEffect } from 'react'

import { useSubscription, useQuery } from '@apollo/react-hooks'

import { AdminControl, UserControl } from '../common'
import { useGameContext } from '../context/useGameContext'
import { findMyUser } from '../gql/queries'
import { listenToRoundsData } from '../gql/subscriptions'
import { useSetUserId, useFindUserById } from '../hooks'

const MyEvents = () => {
  const { isAdmin, userId, currentRound, setCurrentUserData } = useGameContext()
  const { data: roundsData, loading, error } = useSubscription(listenToRoundsData)

  const { data } = useQuery(findMyUser, {
    variables: { id: localStorage.getItem('userId') },
  })

  useEffect(() => {
    console.log('useEffect')
  }, [])

  console.log('MyEvents -> data', roundsData)
  console.log('MyEvents -> data', data)

  if (data && data.users) {
    setCurrentUserData(data.users[0])
  }

  if (!userId) {
    return <div>no user id yet</div>
  }

  if (isAdmin) {
    return <AdminControl />
  }
  return <UserControl />
}

export default MyEvents
