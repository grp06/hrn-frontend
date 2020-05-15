import React, { useEffect, useState } from 'react'

import { useQuery } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'

import { AdminControl, UserControl } from '../common'
import { findMyUser } from '../gql/queries'

const MyEvents = () => {
  const [existingUser, setExistingUser] = useState('')

  useEffect(() => {
    setExistingUser(localStorage.getItem('userID'))
  }, [])

  const { loading, error, data } = useQuery(findMyUser, {
    variables: { id: localStorage.getItem('userID') },
  })

  if (loading || error) return <p>Loading ...</p>

  if (!existingUser) {
    return <Redirect to="/" push />
  }
  if (!data.users.length) return <p>no users yet</p>

  if (data.users[0].isAdmin) {
    return <AdminControl />
  }
  return <UserControl />
}

export default MyEvents
