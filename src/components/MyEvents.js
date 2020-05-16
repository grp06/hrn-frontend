import React, { useEffect, useState } from 'react'

import { useQuery } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'

import { AdminControl, UserControl } from '../common'
import { useGameContext } from '../context/useGameContext'
import { findMyUser } from '../gql/queries'

const MyEvents = () => {
  const myUserId = localStorage.getItem('userID')
  const { userId, getUserId, isAdmin, setCurrentUserData } = useGameContext()
  const { loading, error, data } = useQuery(findMyUser, {
    variables: { id: myUserId },
  })

  useEffect(() => {
    if (data && data.users) {
      setCurrentUserData(data.users[0])
    }
  }, [data])

  if (!myUserId) {
    return <Redirect to="/" push />
  }

  if (loading || error) return <p>Loading ...</p>

  if (!data) return <div>no data</div>

  if (isAdmin) {
    return <AdminControl />
  }
  return <UserControl />
}

export default MyEvents
