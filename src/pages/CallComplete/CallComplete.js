import React, { useEffect } from 'react'
import { useAppContext, useChitChatContext, useUserContext } from '../../context'
import { useParams, useHistory } from 'react-router-dom'

const CallComplete = () => {
  const history = useHistory()
  const { id } = useParams()

  const { chitChat, setEventNewId } = useChitChatContext()

  const { host, host_id, start_at, status: eventStatus } = chitChat
  const chitChatId = parseInt(id, 10)

  useEffect(() => {
    if (!Object.keys(chitChat).length && chitChatId) {
      setEventNewId(parseInt(chitChatId, 10))
    }
  }, [chitChatId, chitChat, setEventNewId])

  useEffect(() => {
    if (eventStatus === 'not-started') {
      history.push(`/chit-chat/${chitChatId}`)
    }
  }, [eventStatus])

  return <div>call complete</div>
}

export default CallComplete
