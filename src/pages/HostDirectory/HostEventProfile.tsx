import React, { useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { CSVLink } from 'react-csv'
import { useHistory } from 'react-router-dom'
import { Grid, Typography } from '@material-ui/core'

import { HostInfoCard, HostEventExpansionPanel, useHostDirectoryStyles } from '.'
import { Loading } from '../../common'
import { getHostEventsAndPartners } from '../../gql/queries'
import { getEventDataCSV, EventObjectInterface } from '../../utils/'

interface HostEventProfileProps {
  location: any
}

interface EventsData {
  events: EventObjectInterface[]
}

interface EventsDataVars {
  user_id: number
}

const HostEventProfile: React.FC<HostEventProfileProps> = ({ location }) => {
  const classes = useHostDirectoryStyles()
  const history = useHistory()
  const locationState = location.state && Object.keys(location.state).length ? location.state : {}
  const [usersEventsArray, setUsersEventsArray] = useState<EventObjectInterface[]>([])
  const eventDataCSV = usersEventsArray?.length ? getEventDataCSV(usersEventsArray) : {}

  const { loading: queryDataLoading } = useQuery<EventsData, EventsDataVars>(
    getHostEventsAndPartners,
    {
      variables: {
        user_id: locationState.host.id,
      },
      skip: !locationState,
      fetchPolicy: 'no-cache',
      onCompleted: (data) => {
        setUsersEventsArray(data.events)
      },
    }
  )

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
    return usersEventsArray.map((event, idx) => {
      console.log('event ->', event)
      return (
        <div key={idx} style={{ marginBottom: '8px' }}>
          <HostEventExpansionPanel event={event} />
        </div>
      )
    })
  }

  return (
    <Grid container direction="column">
      <HostInfoCard hostInfo={locationState.host} />
      {Object.keys(eventDataCSV).length ? (
        <CSVLink
          data={eventDataCSV.data}
          headers={eventDataCSV.headers}
          className={classes.downloadButton}
        >
          Dowload all event data
        </CSVLink>
      ) : null}
      <Grid container className={classes.hostedEventsContainer}>
        <Typography variant="h4" style={{ marginBottom: '16px' }}>
          Events Hosted /
        </Typography>
        {renderEventPanels()}
      </Grid>
    </Grid>
  )
}

export default HostEventProfile
