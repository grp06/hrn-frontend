import React, { useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useAppContext, useChitChatContext, useUserContext } from '../../context'
import { makeStyles } from '@material-ui/styles'
import { RoundProgressBar } from '../VideoRoom'

const useStyles = makeStyles((theme) => ({}))

const ChitChatVideoRoom = () => {
  const classes = useStyles()
  const { id: chitChatId } = useParams()
  const { appLoading } = useAppContext()
  const { onlineChitChatUsersArray } = useChitChatContext()

  const {
    user: { id: userId },
  } = useUserContext()

  const { chitChat, setEventNewId } = useChitChatContext()
  const { host, host_id, start_at, status: event_status } = chitChat
  const { name: hostName, profile_pic_url: hostProfilePicUrl } = host || {}
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

  return (
    <div>
      {currentFan && <RoundProgressBar userUpdatedAt={currentFan.updated_at} event={chitChat} />}
    </div>
  )
}

export default ChitChatVideoRoom
