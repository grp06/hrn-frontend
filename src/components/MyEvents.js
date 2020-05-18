import React, { useEffect, Fragment } from 'react'

import { useSubscription, useQuery } from '@apollo/react-hooks'

import { AdminControl, UserControl } from '../common'
import { useGameContext } from '../context/useGameContext'
import { findMyUser } from '../gql/queries'
import { listenToRoundsData } from '../gql/subscriptions'
import { useSetUserId, useFindUserById } from '../hooks'

const MyEvents = () => {
  const { isAdmin, userId, currentRound, setCurrentUserData } = useGameContext()

  const { data } = useQuery(findMyUser, {
    variables: { id: localStorage.getItem('userId') },
  })

  const { data: roundsData, loading: roundLoading, error } = useSubscription(listenToRoundsData)

  useEffect(() => {
    debugger
    if (data && data.users) {
      setCurrentUserData(data.users[0])
    }
  }, [data])

  if (!userId) {
    return <div>no user id yet</div>
  }

  // setLoading(false)
  return <>{isAdmin ? <AdminControl /> : <UserControl />}</>
}

export default MyEvents
