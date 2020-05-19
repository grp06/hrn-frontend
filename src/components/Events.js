import React, { useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'

import { EventCard } from '../common'
import { useGameContext } from '../context/useGameContext'
import { findMyUser, getEvents } from '../gql/queries'

const Events = () => {
  const { role, userId, setCurrentUserData, setCurrentRound, setRoundsData } = useGameContext()

  const { data: userData } = useQuery(findMyUser, {
    variables: { id: localStorage.getItem('userId') },
  })

  console.log(userData)
  const { data: eventsData, loading, error } = useQuery(getEvents)

  useEffect(() => {
    if (userData && userData.users.length) {
      setCurrentUserData(userData.users[0])
    }
  }, [userData])

  if (loading || !eventsData) {
    return null
  }

  return (
    <div>
      {eventsData.events.map(({ description, event_name, id, host_id }) => {
        return <EventCard key={id} name={event_name} desc={description} id={id} hostId={host_id} />
      })}
    </div>
  )
}

export default Events
