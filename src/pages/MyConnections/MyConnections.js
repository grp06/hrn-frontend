import React from 'react'
import { useQuery } from 'react-apollo'
import { getAllMyConnections } from '../../gql/queries'
import { useAppContext } from '../../context/useAppContext'
import { Loading } from '../../common'

const MyConnections = () => {
  const { app, user } = useAppContext()
  const { userId } = user
  const { appLoading } = app
  const { data: allMyConnectionsData, loading: allMyConnectionsDataLoading } = useQuery(
    getAllMyConnections,
    {
      variables: {
        user_id: userId,
      },
    }
  )

  if (appLoading || allMyConnectionsDataLoading) {
    return <Loading />
  }

  console.log('allMyConnectionsData ->', allMyConnectionsData)
  return <div>Hello there</div>
}

export default MyConnections
