import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { MeetCelebButton, RSVPForEventNewForm } from '.'
import { Loading } from '../../common'
import { useAppContext, useEventNewContext, useUserNewContext } from '../../context'

const EventNew = ({ match }) => {
  const { id: eventNewId } = match.params
  const { appLoading } = useAppContext()
  const { userNew } = useUserNewContext()
  const { eventNew, setEventNewId } = useEventNewContext()
  const { event_users_new, host, host_id, id: event_id, start_at, status: event_status } = eventNew
  const { name: hostName, profile_pic_url: hostProfilePicUrl } = host || {}
  const eventNewSet = Object.keys(eventNew).length > 1

  useEffect(() => {
    if (!Object.keys(eventNew).length && eventNewId) {
      setEventNewId(parseInt(eventNewId, 10))
    }
  }, [eventNewId, eventNew, setEventNewId])

  if (appLoading || Object.keys(eventNew).length < 2) {
    return <Loading />
  }

  return (
    <Grid container direction="column">
      <Typography variant="h2">ChitChat with {hostName}</Typography>
      <Typography variant="h2">insert What To Expect Card here</Typography>
      <MeetCelebButton
        hostName={hostName}
        modalBody={<RSVPForEventNewForm eventNew={eventNew} />}
      />
    </Grid>
  )
}

export default EventNew
