import { useContext } from 'react'

import { GameContext } from './provider'

const useGameContext = () => {
  const [state, dispatch] = useContext(GameContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  function setAttendees(attendees) {
    console.log('setAttendees -> attendees', attendees)
    dispatch((draft) => {
      draft.attendees = attendees
    })
  }

  function setUsers(users) {
    console.log('setUsers -> users', users)
    dispatch((draft) => {
      draft.users = users
    })
  }

  function setToken(token) {
    console.log('setToken -> token')
    dispatch((draft) => {
      draft.token = token
    })
  }

  function setTwilioReady(twilioReady) {
    console.log('setTwilioReady -> twilioReady', twilioReady)
    dispatch((draft) => {
      draft.twilioReady = twilioReady
    })
  }

  function setRoundsData(rounds) {
    console.log('setRoundsData -> rounds', rounds)
    dispatch((draft) => {
      draft.roundsData = rounds
    })
  }

  function setGameData(freshRoundsData, userId) {
    // if you reset or you just press start for the first time
    if (!freshRoundsData || !freshRoundsData.rounds.length) {
      dispatch((draft) => {
        draft.roomId = null
        draft.room = null
        draft.token = null
        draft.twilioReady = false
        draft.myRound = 0
        draft.roundsData = freshRoundsData
        draft.currentRound = freshRoundsData.length ? 1 : 0
      })
    } else {
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
          (round.partnerX_id === parseInt(userId, 10) || round.partnerY_id === parseInt(userId, 10))
        return me
      })

      dispatch((draft) => {
        draft.roundsData = freshRoundsData
        draft.currentRound = currentRound
        draft.myRound = myRound
        draft.token = null
        draft.roomId = myRound ? myRound.id : null

        // reset all these guys between rounds
      })
    }
  }

  function setRoom(room, twilioReady) {
    console.log('setRoom -> room', room)
    dispatch((draft) => {
      draft.room = room
      draft.twilioReady = twilioReady
    })
  }

  function setLoading(loading) {
    console.log('setLoading -> loading', loading)
    dispatch((draft) => {
      draft.loading = loading
    })
  }

  function setRedirect(redirect) {
    console.log('setRedirect -> redirect', redirect)
    dispatch((draft) => {
      draft.redirect = redirect
    })
  }

  function setEventId(eventId) {
    console.log('setEventId -> eventId', eventId)
    dispatch((draft) => {
      draft.eventId = eventId
    })
  }

  function setUserId(userId) {
    console.log('setUserId -> userId', userId)
    dispatch((draft) => {
      draft.userId = userId
    })
  }

  // only used once - in Header.js
  function setCurrentRound(currentRound) {
    console.log('setCurrentRound -> currentRound', currentRound)
    dispatch((draft) => {
      draft.currentRound = currentRound
    })
  }

  function setConnecting(connecting) {
    console.log('setConnecting -> connecting', connecting)
    dispatch((draft) => {
      draft.connecting = connecting
    })
  }

  function resetUserState() {
    dispatch((draft) => {
      draft.token = null
      draft.roomId = null
      draft.room = null
      draft.twilioReady = false
    })
  }

  return {
    ...state,
    setUsers,
    setRoundsData,
    setLoading,
    setRedirect,
    setEventId,
    setGameData,
    setToken,
    setTwilioReady,
    setRoom,
    resetUserState,
    setUserId,
    setAttendees,
    setCurrentRound,
    setConnecting,
  }
}

export { useGameContext }
