import { useContext } from 'react'

import { GameContext } from './provider'

const useGameContext = () => {
  const [state, dispatch] = useContext(GameContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  function setUsers(users) {
    dispatch((draft) => {
      draft.users = users
    })
  }

  function setToken(token) {
    dispatch((draft) => {
      draft.token = token
    })
  }

  function setTwilioReady(twilioReady) {
    dispatch((draft) => {
      draft.twilioReady = twilioReady
    })
  }

  function setLocalVideoTrack(localVideoTrack) {
    dispatch((draft) => {
      draft.localVideoTrack = localVideoTrack
    })
  }

  function setRoundsData(rounds) {
    dispatch((draft) => {
      draft.roundsData = rounds
    })
  }

  function setGameData(roundsData, userId, shouldSetMyRound) {
    let myRound
    let currentRound
    if (shouldSetMyRound) {
      currentRound = roundsData.rounds[roundsData.rounds.length - 1].round_number

      myRound = roundsData.rounds.find((round) => {
        const me =
          round.round_number === currentRound &&
          (round.partnerX_id === parseInt(userId, 10) || round.partnerY_id === parseInt(userId, 10))

        return me
      })
    }

    dispatch((draft) => {
      if (myRound) {
        draft.roundsData = roundsData
        draft.currentRound = currentRound
      } else {
      }
      draft.myRound = myRound
      // reset all these guys between rounds
      draft.roomId = null
      draft.room = null
      draft.token = null
      draft.twilioReady = false
    })
  }

  function setRoomId(roomId) {
    dispatch((draft) => {
      draft.roomId = roomId
    })
  }

  function setRoom(room) {
    dispatch((draft) => {
      draft.room = room
    })
  }

  function setLoading(loading) {
    dispatch((draft) => {
      draft.loading = loading
    })
  }

  function setRedirect(redirect) {
    dispatch((draft) => {
      draft.redirect = redirect
    })
  }

  function setEventId(eventId) {
    dispatch((draft) => {
      draft.eventId = eventId
    })
  }

  function resetUserState() {
    dispatch((draft) => {
      draft.token = null
      draft.roomId = null
      draft.localVideoTrack = null
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
    setRoomId,
    setGameData,
    setToken,
    setTwilioReady,
    setLocalVideoTrack,
    setRoom,
    resetUserState,
  }
}

export { useGameContext }
