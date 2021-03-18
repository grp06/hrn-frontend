import React, { useRef, useState } from 'react'
import { useQuery } from 'react-apollo'
import { Redirect } from 'react-router-dom'

import { useHostDirectoryStyles } from '.'
import { Loading } from '../../common'
import { useUserContext } from '../../context'
import { getUsersByRoleName } from '../../gql/queries'
import { constants } from '../../utils'

const HostDirectory: React.FC<{}> = () => {
  const classes = useHostDirectoryStyles()
  const user = useUserContext()
  const { adminUserIds, hrnFriendsUserIds } = constants
  const { id: userId } = user
  const now = useRef(new Date().toISOString())

  const { data: hostData, loading: hostDataLoading } = useQuery(getUsersByRoleName, {
    variables: {
      role: 'host',
    },
  })

  const { data: hostStarterData, loading: hostStarterDataLoading } = useQuery(getUsersByRoleName, {
    variables: {
      role: 'host_starter',
      now: now.current,
    },
  })

  const { data: hostPremiumData, loading: hostPremiumDataLoading } = useQuery(getUsersByRoleName, {
    variables: {
      role: 'host_premium',
      now: now.current,
    },
  })

  if (userId && !adminUserIds.includes(userId)) {
    return <Redirect to="/" />
  }

  if (hostDataLoading || hostStarterDataLoading || hostPremiumDataLoading) {
    return <Loading />
  }

  console.log('hostData ->', hostData)
  console.log('hostStarterData ->', hostStarterData)
  console.log('hostPremiumData ->', hostPremiumData)

  return <div>Hello</div>
}
export default HostDirectory
