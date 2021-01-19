import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { MeetCelebButton, RSVPForChitChatForm } from '.'
import { Loading } from '../../common'
import { useAppContext, useChitChatContext, useUserContext } from '../../context'

const ChitChat = ({ match }) => {
  const { id: chitChatId } = match.params
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const { chitChat, setEventNewId } = useChitChatContext()
  const { event_users_new, host, host_id, id: event_id, start_at, status: event_status } = chitChat
  const { name: hostName, profile_pic_url: hostProfilePicUrl } = host || {}
  const chitChatSet = Object.keys(chitChat).length > 1

  useEffect(() => {
    if (!Object.keys(chitChat).length && chitChatId) {
      setEventNewId(parseInt(chitChatId, 10))
    }
  }, [chitChatId, chitChat, setEventNewId])

  if (appLoading || Object.keys(chitChat).length < 2) {
    return <Loading />
  }

  return (
    <Grid container direction="column">
      <Typography variant="h2">ChitChat with {hostName}</Typography>
      <Typography variant="h2">insert What To Expect Card here</Typography>
      <MeetCelebButton
        hostName={hostName}
        modalBody={<RSVPForChitChatForm chitChat={chitChat} />}
      />
    </Grid>
  )
}

export default ChitChat
