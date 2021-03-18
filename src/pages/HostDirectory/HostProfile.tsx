import React, { useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { CSVLink } from 'react-csv'
import { useHistory } from 'react-router-dom'
import { Grid, Typography } from '@material-ui/core'

import { HostInfoCard, HostEventExpansionPanel, useHostDirectoryStyles } from '.'
import { Loading } from '../../common'
import { getHostEventsAndPartners } from '../../gql/queries'
import { getEventDataCSV, EventObjectInterface } from '../../utils/'

interface HostProfileProps {
  location: any
}

interface EventsData {
  events: EventObjectInterface[]
}

interface EventsDataVars {
  user_id: number
}

const HostProfile: React.FC<HostProfileProps> = ({ location }) => {
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
        setUsersEventsArray(
          data.events.sort((eventA, eventB) => {
            if (eventA && eventB) {
              if (Date.parse(eventA.start_at) < Date.parse(eventB.start_at)) {
                return 1
              }
            }
            return -1
          })
        )
      },
    }
  )

  const redirectUserBackToHostDirectory = useCallback(() => {
    if (!Object.keys(locationState).length) {
      return history.push('/host-directory')
    }
  }, [history, locationState])

  useEffect(() => {
    redirectUserBackToHostDirectory()
    return () => {
      window.history.replaceState({}, '')
    }
  }, [redirectUserBackToHostDirectory])

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

export default HostProfile
