import React, { useEffect, useState } from 'react'

import { useSubscription, useQuery } from '@apollo/react-hooks'

import { EventForm, AdminControl, UserControl, Loading } from '../common'

import { useGameContext } from '../context/useGameContext'
import { listenToRounds } from '../gql/subscriptions'
import { getEvent } from '../gql/queries'
import { PreEvent } from '.'

const Event = ({ match }) => {
  const { id: eventId } = match.params
  const {
    appLoading,
    setGameData,
    currentRound,
    resetUserState,
    userId,
    roundsData,
  } = useGameContext()
  // decoding thing here
  const { data: eventData, loading: eventLoading, error: eventError } = useQuery(getEvent, {
    variables: {
      id: eventId,
    },
  })

  const {
    data: freshRoundsData,
    loading: roundDataLoading,
    error: roundDataError,
  } = useSubscription(listenToRounds, {
    variables: {
      eventId: eventId,
    },
  })

  const hasSubscriptionData = freshRoundsData && freshRoundsData.rounds
  const hostId = eventData && eventData.events[0].host_id

  useEffect(() => {
    if (freshRoundsData && freshRoundsData.rounds.length === 0 && currentRound === 0) {
      return resetUserState()
    }
  }, [freshRoundsData, currentRound])

  useEffect(() => {
    if (hasSubscriptionData) {
      if (!roundsData || !roundsData.rounds.length) {
        return setGameData(freshRoundsData, userId)
      }

      const roundsDataLength = roundsData.rounds.length
      const freshRoundsDataLength = freshRoundsData.rounds.length
      const newRoundsData = freshRoundsDataLength > roundsDataLength
      const adminIsResettingGame = freshRoundsDataLength < roundsDataLength

      if (newRoundsData || adminIsResettingGame) {
        return setGameData(freshRoundsData, userId)
      }
    }
  }, [freshRoundsData, hasSubscriptionData])

  if (roundDataError) {
    console.log('roundDataError - ', roundDataError)
    return <div>Looks like we hit a hiccup. Please refresh your browser.</div>
  }

  if (appLoading) {
    return <Loading />
  }
  // probably need to move this into useEffect
  if (eventData) {
    const startTime = new Date(eventData.events[0].start_at).getTime()
    const now = Date.now()
    const diff = startTime - now
    if (diff >= 1800000) {
      console.log('show edit event form')
      // show editable event form
      return <PreEvent eventData={eventData} />
    }
    if (diff < 1800000 && diff >= 0) {
      // display countdown and show online users
      console.log('display countdown and online users')
    } else {
      console.log('start this event dawg!')
      // event start time is passed, display "start" button
    }
  }

  return <>{hostId === userId && currentRound === 0 ? <AdminControl /> : <UserControl />}</>
}

export default Event
