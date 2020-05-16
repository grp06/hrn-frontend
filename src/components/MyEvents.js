import React, { useEffect, useState } from 'react'

import { useQuery } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'

import { AdminControl, UserControl } from '../common'
import { useGameContext } from '../context/useGameContext'
import { findMyUser } from '../gql/queries'

const MyEvents = () => {
  const { userId, getUserId, isAdmin, setCurrentUserData } = useGameContext()
  const { loading, error, data } = useQuery(findMyUser, {
    variables: { id: userId },
  })

  useEffect(() => {
    getUserId()
  }, [getUserId])

  if (loading || error) return <p>Loading ...</p>
  if (!userId) {
    return <Redirect to="/" push />
  }

  if (!data) return <div>no data</div>

  setCurrentUserData(data.users[0])

  console.log('isAdmin = ', isAdmin)
  if (isAdmin) {
    return <AdminControl />
  }
  return <UserControl />
}

export default MyEvents
