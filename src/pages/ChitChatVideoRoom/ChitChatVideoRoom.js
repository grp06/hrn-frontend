import React, { useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import {
  useAppContext,
  useChitChatContext,
  useUserContext,
  useChitChatUserStatusContext,
} from '../../context'
import { makeStyles } from '@material-ui/styles'
import { RoundProgressBar } from '../VideoRoom'

const useStyles = makeStyles((theme) => ({}))

const ChitChatVideoRoom = () => {
  const classes = useStyles()
  const { id: chitChatId } = useParams()
  const { appLoading } = useAppContext()
  const { onlineChitChatUsersArray } = useChitChatUserStatusContext()

  const {
    user: { id: userId },
  } = useUserContext()

  const { chitChat, setEventNewId } = useChitChatContext()
  const { event_users_new, host, host_id, start_at, status: event_status } = chitChat
  const { name: hostName, profile_pic_url: hostProfilePicUrl } = host || {}
  const userIsHost = parseInt(host_id, 10) === parseInt(userId, 10)
  const history = useHistory()

  // const { firstUpdate } = location.state
  const currentFan = onlineChitChatUsersArray.find((fan) => fan.status === 'in-chat')

  useEffect(() => {
    if (!Object.keys(chitChat).length && chitChatId) {
      setEventNewId(parseInt(chitChatId, 10))
    }
  }, [chitChatId, chitChat, setEventNewId])

  useEffect(() => {
    if (event_status === 'not-started') {
      history.push(`/chit-chat/${chitChatId}`)
    }
  }, [event_status])
  if (currentFan) {
    console.log('updating current fan updated_at ', currentFan.updated_at)
  }
  return (
    <div>
      {currentFan && <RoundProgressBar userUpdatedAt={currentFan.updated_at} event={chitChat} />}
    </div>
  )
}

export default ChitChatVideoRoom
