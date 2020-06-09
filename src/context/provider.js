import React, { useState, useEffect } from 'react'

import { useQuery, useSubscription, useMutation } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { Redirect } from 'react-router-dom'

import { findUserById, getEventsByUserId } from '../gql/queries'
import { listenToRounds } from '../gql/subscriptions'
import { getToken } from '../helpers'
import { updateLastSeen } from '../gql/mutations'
import { constants } from '../utils'
import { GUMErrorModal } from '../common'

const { lastSeenDuration } = constants

const { createLocalTracks, connect } = require('twilio-video')

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
  userId: null,
  hasUpcomingEvent: false,
  eventsData: null,
  attendees: null,
  waitingRoom: null,
  room: null,
  didPartnerDisconnect: false,
}

const GameProvider = ({ children, location }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const [isGUMErrorModalActive, setIsGUMErrorModalActive] = useState(false)
  const [GUMError, setGUMError] = useState('')

  const { data: userData, loading: userDataLoading, error: userDataError } = useQuery(
    findUserById,
    {
      variables: { id: state.userId },
      skip: !state.userId,
    }
  )

  const { data: eventsData, loading: eventsDataLoading, error: eventsError } = useQuery(
    getEventsByUserId,
    {
      variables: {
        userId: state.userId,
      },
      skip: !state.userId || !state.role,
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
    skip: !state.eventId && !state.eventsData,
  })

  const [updateLastSeenMutation] = useMutation(updateLastSeen, {
    variables: {
      now: new Date().toISOString(),
      id: state.userId,
    },
    skip: !state.hasUpcomingEvent,
  })

  useEffect(() => {
    if (state.hasUpcomingEvent) {
      const interval = setInterval(async () => {
        try {
          await updateLastSeenMutation()
        } catch (error) {
          console.log('error = ', error)
        }
      }, lastSeenDuration)
      return () => {
        clearInterval(interval)
      }
    }
  }, [state.hasUpcomingEvent, state.role])

  useEffect(() => {
    if (state.token) {
      const setupRoom = async () => {
        let localTracks
        try {
          localTracks = await createLocalTracks({
            video: true,
            audio: true,
          })
        } catch (err) {
          console.log(err.name)
          setGUMError(err.name)
          return setIsGUMErrorModalActive(true)
        }

        const myRoom = await connect(state.token, {
          name: state.roomId,
          tracks: localTracks,
        })
        dispatch((draft) => {
          draft.room = myRoom
        })
      }
      setupRoom()
    }
  }, [state.token])

  useEffect(() => {
    const { myRound } = state
    const hasPartner = myRound && myRound.partnerX_id && myRound.partnerY_id
    if (!state.room && state.roomId && hasPartner) {
      const getTwilioToken = async () => {
        const token = await getToken(state.roomId, state.userId).then((response) => response.json())
        dispatch((draft) => {
          draft.token = token.token
        })
      }
      getTwilioToken()
    }
  }, [state.roomId, state.room])

  useEffect(() => {
    if (!freshRoundsDataLoading && freshRoundsData && freshRoundsData.rounds) {
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

      if (!state.roundsData && freshRoundsData.rounds) {
        // page just reloaded, set data

        return dispatch((draft) => {
          draft.roundsData = freshRoundsData
          draft.currentRound = currentRound
          draft.myRound = myRound
          draft.roomId = myRound && !myRound.ended_at ? myRound.id : null
          draft.waitingRoom = myRound ? myRound.ended_at : null
          draft.appLoading = false
        })
      }

      const roundsDataLength = state.roundsData.rounds.length
      const freshRoundsDataLength = freshRoundsData.rounds.length
      const newRoundsData = freshRoundsDataLength > roundsDataLength
      const adminIsResettingGame = freshRoundsDataLength < roundsDataLength

      if (newRoundsData || adminIsResettingGame) {
        // round changed

        // in the future we can probably remove this unnecessarily safe check

        const currentEvent =
          state.eventsData &&
          state.eventsData.event_users.length &&
          state.eventsData.event_users.find((event) => state.eventId === event.event.id)
        const { ended_at } = currentEvent.event

        return dispatch((draft) => {
          draft.roundsData = freshRoundsData
          draft.currentRound = currentRound
          draft.myRound = myRound
          draft.roomId = myRound && !ended_at ? myRound.id : null
          draft.appLoading = false
          if (adminIsResettingGame) {
            draft.waitingRoom = false
          }
        })
      }

      // if you reset or you just press start for the first time
      if (!state.roundsData || !state.roundsData.rounds.length) {
        const eventComplete = state.eventsData.event_users

        return dispatch((draft) => {
          draft.roomId = null
          draft.room = null
          draft.token = null
          draft.myRound = 0
          draft.roundsData = freshRoundsData
          draft.currentRound = freshRoundsData.length ? 1 : 0
          draft.appLoading = false
        })
      }
    }
  }, [freshRoundsData, freshRoundsDataLoading])

  useEffect(() => {
    if (freshRoundsData && freshRoundsData.rounds.length === 0 && state.currentRound === 0) {
      // !!! examine if we actaully need this???
      dispatch((draft) => {
        draft.token = null
        draft.roomId = null
        draft.room = null
        draft.attendees = null
      })
    }
  }, [freshRoundsData, state.currentRound])

  useEffect(() => {
    if (eventsData) {
      const hasUpcomingEvent = eventsData.event_users.find((event) => {
        const { start_at, ended_at } = event.event
        const startTime = new Date(start_at).getTime()
        const now = Date.now()
        const diff = startTime - now

        // event is upcoming or in progress
        return diff < 1800000 && !ended_at
      })

      dispatch((draft) => {
        draft.eventsData = eventsData
        draft.hasUpcomingEvent = hasUpcomingEvent
      })
    }
  }, [eventsData, state.role])

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
        draft.appLoading = false
      })
    }
  }, [])

  if (state.room && state.currentRound > 0 && window.location.pathname !== '/video-room') {
    return <Redirect to="/video-room" push />
  }

  return (
    <GameContext.Provider value={[state, dispatch]}>
      {
        <div>
          {children}
          {isGUMErrorModalActive ? (
            <GUMErrorModal
              onComplete={() => setIsGUMErrorModalActive(false)}
              errorName={GUMError}
            />
          ) : null}
        </div>
      }
    </GameContext.Provider>
  )
}

export { GameProvider, GameContext }
