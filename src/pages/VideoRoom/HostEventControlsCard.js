import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useQuery } from '@apollo/react-hooks'
import { TransitionModal } from '../../common'
import { startEvent } from '../../helpers'
import { getAllPartnersForRound } from '../../gql/queries'
import { useVideoRoomStyles } from '.'

const HostEventControlsCard = React.memo(({ event }) => {
  const classes = useVideoRoomStyles()
  const { host_id, id: eventId, current_round: round } = event
  const { data: allPartnersData } = useQuery(getAllPartnersForRound, {
    variables: { event_id: eventId, round },
  })

  const renderResetEvent = (
    <TransitionModal
      button={{
        buttonText: 'Reset Event',
        buttonVariant: 'text',
        buttonColor: 'link',
      }}
      modalBody={
        <Typography variant="h3">
          This will reset the event in its entirety. Are you 100% sure?
        </Typography>
      }
      onAcceptFunction={async () => {
        window.analytics &&
          window.analytics.track('Event reset', {
            eventId,
            hostId: host_id,
          })
        await startEvent({ eventId, num_rounds: null, round_length: null, reset: true })
      }}
    />
  )

  return (
    <Grid
      container
      direction="column"
      justify="space-evenly"
      alignItems="center"
      className={classes.container}
    >
      <Typography variant="subtitle1" className={classes.onlineUsersText}>
        Online Users:{' '}
        {allPartnersData && allPartnersData.partners.length
          ? allPartnersData.partners.length
          : ' --'}
      </Typography>
      {renderResetEvent}
    </Grid>
  )
})

export default HostEventControlsCard
