import React, { useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useAppContext, useChitChatContext, useUserContext } from '../../context'
import { makeStyles } from '@material-ui/styles'
import { RoundProgressBar } from '../VideoRoom'
import Button from '@material-ui/core/Button'
import { useChitChatHelpers } from '../../helpers'

const useStyles = makeStyles((theme) => ({}))

const ChitChatVideoRoom = () => {
  const classes = useStyles()
  const { id } = useParams()
  const chitChatId = parseInt(id, 10)

  const { appLoading } = useAppContext()
  const { onlineChitChatUsersArray } = useChitChatContext()
  const { resetChitChat } = useChitChatHelpers()
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
      setEventNewId(chitChatId)
    }
  }, [chitChatId, chitChat, setEventNewId])

  useEffect(() => {
    if (event_status === 'not-started') {
      history.push(`/chit-chat/${chitChatId}`)
    }
  }, [event_status])

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => resetChitChat({ onlineChitChatUsersArray, chitChatId, userId })}
      >
        reset
      </Button>
      {currentFan && <RoundProgressBar userUpdatedAt={currentFan.updated_at} event={chitChat} />}
    </div>
  )
}

export default ChitChatVideoRoom
