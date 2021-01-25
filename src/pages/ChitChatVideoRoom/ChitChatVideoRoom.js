import React, { useEffect } from 'react'
import { useAppContext, useChitChatContext, useUserContext } from '../../context'
import { makeStyles } from '@material-ui/styles'
import { useParams, useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({}))

const ChitChatVideoRoom = () => {
  const classes = useStyles()
  const { id: chitChatId } = useParams()
  const { appLoading } = useAppContext()
  const {
    user: { id: userId },
  } = useUserContext()
  const { chitChat, setEventNewId } = useChitChatContext()
  console.log('🚀 ~ ChitChatVideoRoom ~ chitChat', chitChat)
  const { event_users_new, host, host_id, start_at, status: event_status } = chitChat
  const { name: hostName, profile_pic_url: hostProfilePicUrl } = host || {}
  const userIsHost = parseInt(host_id, 10) === parseInt(userId, 10)
  const history = useHistory()

  useEffect(() => {
    if (!Object.keys(chitChat).length && chitChatId) {
      setEventNewId(parseInt(chitChatId, 10))
    }
  }, [chitChatId, chitChat, setEventNewId])

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ event_status', event_status)
    if (event_status === 'not-started') {
      history.push(`/chit-chat/${chitChatId}`)
    }
  }, [event_status])

  return <div>chit chat video room</div>
}

export default ChitChatVideoRoom
