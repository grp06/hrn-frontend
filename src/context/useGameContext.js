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

  function setGameData(freshRoundsData, userId) {
    console.log('freshRoundsData ', freshRoundsData)
    // if you reset or you just press start for the first time
    if (!freshRoundsData || !freshRoundsData.rounds.length) {
      dispatch((draft) => {
        draft.roomId = null
        draft.room = null
        draft.token = null
        draft.twilioReady = false
        draft.myRound = 0
        draft.roundsData = freshRoundsData
        draft.currentRound = freshRoundsData === null ? 1 : 0
      })
    } else {
      const currentRound = freshRoundsData.rounds.reduce((all, item) => {
        if (item.round_number > all) {
          return item.round_number
        }
        return all
      }, 0)
      debugger
      const myRound = freshRoundsData.rounds.find((round) => {
        const me =
          round.round_number === currentRound &&
          (round.partnerX_id === parseInt(userId, 10) || round.partnerY_id === parseInt(userId, 10))
        return me
      })
      console.log('currentRound = ', currentRound)
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

  function setRoomId(roomId) {
    dispatch((draft) => {
      draft.roomId = roomId
    })
  }

  function setRoom(room, twilioReady) {
    console.log('room = ', room)

    dispatch((draft) => {
      draft.room = room
      draft.twilioReady = twilioReady
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
