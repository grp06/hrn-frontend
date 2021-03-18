import React, { useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useHistory } from 'react-router-dom'

import { Loading } from '../../common'
import { getEventsByUserId } from '../../gql/queries'
import { EventObjectInterface } from '../../utils'

interface HostEventProfileProps {
  location: any
}

interface EventsData {
  event_users: { [event: string]: EventObjectInterface }[]
}

interface EventsDataVars {
  userId: number
}

const HostEventProfile: React.FC<HostEventProfileProps> = ({ location }) => {
  const history = useHistory()
  const locationState = location.state && Object.keys(location.state).length ? location.state : {}
  const [usersEventsArray, setUsersEventsArray] = useState<
    { [event: string]: EventObjectInterface }[]
  >([])

  const { data: getEventsByUserIdData, loading: queryDataLoading } = useQuery<
    EventsData,
    EventsDataVars
  >(getEventsByUserId, {
    variables: {
      userId: locationState.host_id,
    },
    skip: !locationState,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setUsersEventsArray(data.event_users)
    },
  })
  console.log('🌈 ~ getEventsByUserIdData', getEventsByUserIdData)
  console.log('usersEventsArray ->', usersEventsArray)

  const redirectUserBackToPaidHostDashboard = useCallback(() => {
    if (!Object.keys(locationState).length) {
      return history.push('/paid-host-dashboard')
    }
  }, [history, locationState])

  useEffect(() => {
    redirectUserBackToPaidHostDashboard()
    return () => {
      window.history.replaceState({}, '')
    }
  }, [redirectUserBackToPaidHostDashboard])

  if (queryDataLoading) {
    return <Loading />
  }

  return <div>Hello</div>
}

export default HostEventProfile
