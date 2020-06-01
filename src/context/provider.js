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

  const { data: userEventsData, loading: eventsLoading, error: eventsError } = useQuery(
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
    loading: roundDataLoading,
    error: roundDataError,
  } = useSubscription(listenToRounds, {
    variables: {
      event_id: state.eventId,
    },
  })

  const hasSubscriptionData = freshRoundsData && freshRoundsData.rounds

  useEffect(() => {
    if (hasSubscriptionData) {
      console.log('Event -> freshRoundsData', freshRoundsData)

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
        console.log('setGameData -> freshRoundsData', freshRoundsData)

        const myRound = freshRoundsData.rounds.find((round) => {
          const me =
            round.round_number === currentRound &&
            (round.partnerX_id === parseInt(state.userId, 10) ||
              round.partnerY_id === parseInt(state.userId, 10))
          return me
        })

        return dispatch((draft) => {
          draft.roundsData = freshRoundsData
          draft.currentRound = currentRound
          draft.myRound = myRound
          draft.token = null
          draft.roomId = myRound ? myRound.id : null

          // reset all these guys between rounds
        })
      }
    }
  }, [freshRoundsData, hasSubscriptionData])

  useEffect(() => {
    if (freshRoundsData && freshRoundsData.rounds.length === 0 && state.currentRound === 0) {
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
        draft.appLoading = false
      })
    }

    if (state.role === 'host' && hostEventsData) {
      dispatch((draft) => {
        draft.hostEventsData = hostEventsData
        draft.appLoading = false
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
        if (draft.userId) {
          console.log('userId', draft.userId)
        }
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
