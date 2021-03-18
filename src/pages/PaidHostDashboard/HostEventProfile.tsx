import React, { useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useHistory } from 'react-router-dom'
import { Grid } from '@material-ui/core'

import { HostInfoCard, HostEventExpansionPanel } from '../HostDirectory'
import { Loading } from '../../common'
import { getHostEventsAndPartners } from '../../gql/queries'
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
  >(getHostEventsAndPartners, {
    variables: {
      user_id: locationState.host.id,
    },
    skip: !locationState,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setUsersEventsArray(data.event_users)
    },
  })

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

  const renderEventPanels = () => {
    return usersEventsArray.map((event) => {
      return (
        <div key={event.event.id} style={{ marginBottom: '8px' }}>
          <HostEventExpansionPanel event={event.event} />
        </div>
      )
    })
  }

  return (
    <Grid container direction="column">
      <HostInfoCard hostInfo={locationState.host} />
      <Grid container style={{ width: '85%' }}>
        {renderEventPanels()}
      </Grid>
    </Grid>
  )
}

export default HostEventProfile
