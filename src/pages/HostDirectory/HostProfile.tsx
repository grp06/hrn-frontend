import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { CSVLink } from 'react-csv'
import { Grid, Typography } from '@material-ui/core'

import {
  AggregateHostEventDataCard,
  HostInfoCard,
  HostEventExpansionPanel,
  useHostDirectoryStyles,
} from '.'
import { Loading } from '../../common'
import { findUserById, getHostEventsAndPartners } from '../../gql/queries'
import { getEventDataCSV, EventObjectInterface } from '../../utils/'

interface EventsData {
  events: EventObjectInterface[]
}

interface EventsDataVars {
  user_id: number
}

const HostProfile: React.FC<{}> = () => {
  const classes = useHostDirectoryStyles()
  const { pathname } = window.location
  const pathnameArray = pathname.split('/')
  const hostIdFromURL = parseInt(pathnameArray[2], 10)
  const [usersEventsArray, setUsersEventsArray] = useState<EventObjectInterface[]>([])
  const eventDataCSV = usersEventsArray?.length ? getEventDataCSV(usersEventsArray) : {}

  const { loading: queryDataLoading } = useQuery<EventsData, EventsDataVars>(
    getHostEventsAndPartners,
    {
      variables: {
        user_id: hostIdFromURL,
      },
      skip: !hostIdFromURL,
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

  const { data: hostInfo, loading: hostInfoQueryDataLoading } = useQuery(findUserById, {
    variables: {
      id: hostIdFromURL,
    },
  })

  if (queryDataLoading || hostInfoQueryDataLoading) {
    return <Loading />
  }

  const renderEventPanels = () => {
    return usersEventsArray.map((event, idx) => {
      return (
        <div key={idx} style={{ marginBottom: '8px' }}>
          <HostEventExpansionPanel event={event} />
        </div>
      )
    })
  }

  return (
    <Grid container direction="column">
      <HostInfoCard hostInfo={hostInfo.users[0]} />
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
          Aggregate Event Data /
        </Typography>
        <AggregateHostEventDataCard
          becameHostAt={hostInfo.users[0].became_host_at}
          events={usersEventsArray}
        />
      </Grid>
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
