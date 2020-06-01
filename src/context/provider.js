import React, { useEffect } from 'react'

import { useQuery, useSubscription } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'
import { useImmer } from 'use-immer'
import { findUsers, findMyUser, getEventsByUserId, getHostEvents } from '../gql/queries'
import { listenToRounds } from '../gql/subscriptions'

const GameContext = React.createContext()

const defaultState = {
  appLoading: true,
  currentRound: 0,
  eventId: null,
  myRound: null,
  name: '',
  roundsData: null,
  redirect: null,
  role: '',
  roomId: null,
  token: null,
  twilioReady: false,
  userId: null,
  hasUpcomingEvent: false,
  userEventsData: null,
  hostEventsData: null,
  attendees: null,
  connecting: null,
}

const GameProvider = ({ children, location }) => {
  const [state, dispatch] = useImmer({ ...defaultState })

  const { data: userData, loading: userDataLoading, error: userDataError } = useQuery(findMyUser, {
    variables: { id: state.userId },
    skip: !state.userId,
  })

  const { data: userEventsData, loading: userEventsLoading, error: eventsError } = useQuery(
    getEventsByUserId,
    {
      variables: {
        userId: state.userId,
      },
      skip: !state.userId || state.role === 'host',
    }
  )

  const { data: hostEventsData, loading: hostEventsLoading, error: hostEventsError } = useQuery(
    getHostEvents,
    {
      variables: {
        userId: state.userId,
      },
      skip: !state.userId || state.role === 'user',
    }
  )

  const {
    data: freshRoundsData,
    loading: freshRoundsDataLoading,
    error: roundDataError,
  } = useSubscription(listenToRounds, {
    variables: {
      event_id: state.eventId,
    },
  })

  const hasSubscriptionData = freshRoundsData && freshRoundsData.rounds

  const apiCallsDone =
    !userDataLoading && !userEventsLoading && !hostEventsLoading && !freshRoundsDataLoading

  useEffect(() => {
    if (apiCallsDone) {
      dispatch((draft) => {
        draft.appLoading = false
      })
    }
  }, [apiCallsDone])

  useEffect(() => {
    if (hasSubscriptionData) {
      // if you reset or you just press start for the first time
      if (!state.roundsData || !state.roundsData.rounds.length) {
        return dispatch((draft) => {
          draft.roomId = null
          draft.room = null
          draft.token = null
          draft.twilioReady = false
          draft.myRound = 0
          draft.roundsData = freshRoundsData
          draft.currentRound = freshRoundsData.length ? 1 : 0
        })
      }

      const roundsDataLength = state.roundsData.rounds.length
      const freshRoundsDataLength = freshRoundsData.rounds.length
      const newRoundsData = freshRoundsDataLength > roundsDataLength
      const adminIsResettingGame = freshRoundsDataLength < roundsDataLength

      if (newRoundsData || adminIsResettingGame) {
        const currentRound = freshRoundsData.rounds.reduce((all, item) => {
          if (item.round_number > all) {
            return item.round_number
          }
          return all
        }, 0)

        const myRound = freshRoundsData.rounds.find((round) => {
          const me =
            round.round_number === currentRound &&
            (round.partnerX_id === parseInt(state.userId, 10) ||
              round.partnerY_id === parseInt(state.userId, 10))
          return me
        })
        // round changed
        return dispatch((draft) => {
          draft.roundsData = freshRoundsData
          draft.currentRound = currentRound
          draft.myRound = myRound
          draft.token = null
          draft.roomId = myRound ? myRound.id : null
        })
      }
    }
  }, [freshRoundsData, hasSubscriptionData])

  useEffect(() => {
    if (freshRoundsData && freshRoundsData.rounds.length === 0 && state.currentRound === 0) {
      // admin pressed reset
      dispatch((draft) => {
        draft.token = null
        draft.roomId = null
        draft.room = null
        draft.twilioReady = false
      })
    }
  }, [freshRoundsData, state.currentRound])

  useEffect(() => {
    if (state.role === 'user' && userEventsData) {
      // when do we use this? Something for online users?
      const startingSoon = userEventsData.event_users.find((event) => {
        const { start_at } = event.event
        const startTime = new Date(start_at).getTime()
        const now = Date.now()
        const diff = startTime - now
        // event is upcoming or in progress
        return diff < 1800000
      })
      dispatch((draft) => {
        draft.userEventsData = userEventsData
        draft.startingSoon = startingSoon
      })
    }

    if (state.role === 'host' && hostEventsData) {
      dispatch((draft) => {
        draft.hostEventsData = hostEventsData
      })
    }
  }, [hostEventsData, userEventsData, state.role])

  useEffect(() => {
    if (userData && userData.users.length) {
      const { name, role, id } = userData.users[0]

      dispatch((draft) => {
        draft.role = role
        draft.userId = id
        draft.name = name
      })
    }
  }, [userData])

  useEffect(() => {
    if (!state.userId) {
      const myUserId = localStorage.getItem('userId')
      if (!myUserId && state.redirect === null) {
        return dispatch((draft) => {
          draft.redirect = true
          draft.appLoading = false
        })
      }
      dispatch((draft) => {
        draft.userId = myUserId
      })
    }
  }, [])

  if (state.redirect && location.pathname !== '/') {
    return <Redirect to="/" push />
  }

  return <GameContext.Provider value={[state, dispatch]}>{children}</GameContext.Provider>
}

export { GameProvider, GameContext }
