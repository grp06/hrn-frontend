import React, { useEffect } from 'react'
import { Loading } from '../../common'
import { useAppContext, useEventNewContext, useUserNewContext } from '../../context'

const EventNew = ({ match }) => {
  const { id: eventNewId } = match.params
  const { appLoading } = useAppContext()
  const { userNew } = useUserNewContext()
  const { eventNew, setEventNewId } = useEventNewContext()

  useEffect(() => {
    if (!Object.keys(eventNew).length && eventNewId) {
      setEventNewId(parseInt(eventNewId, 10))
    }
  }, [eventNewId, eventNew, setEventNewId])

  if (appLoading || Object.keys(eventNew).length < 2) {
    return <Loading />
  }

  return <div>Test</div>
}

export default EventNew
