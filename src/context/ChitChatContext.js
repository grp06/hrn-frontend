import React, { useEffect, createContext, useContext } from 'react'

import { useSubscription } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory } from 'react-router-dom'
import { useAppContext, useUserContext } from '.'
import { listenToChitChat } from '../gql/subscriptions'

const ChitChatContext = createContext()

// types of status for event-new include
// 1) not-started
// 2) call-in-progress
// 3) paused
// 4) completed
const defaultState = {
  // chitChatId is for chitChat subscriptions
  chitChatId: null,
  chitChat: {},
  userHasEnabledCameraAndMic: false,
}

const useChitChatContext = () => {
  const [state, dispatch] = useContext(ChitChatContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const resetEventNew = () => {
    dispatch((draft) => {
      draft.chitChat = {}
    })
  }

  const setUserHasEnabledCameraAndMic = (userHasEnabledCameraAndMic) => {
    dispatch((draft) => {
      draft.userHasEnabledCameraAndMic = userHasEnabledCameraAndMic
    })
  }

  const setEventNewId = (chitChatId) => {
    dispatch((draft) => {
      draft.chitChatId = chitChatId
    })
  }

  return {
    ...state,
    resetEventNew,
    setEventNewId,
    setUserHasEnabledCameraAndMic,
  }
}

const ChitChatProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const { setAppLoading } = useAppContext()
  const { user } = useUserContext()
  const { id: userId } = user

  const { pathname } = window.location
  const { chitChat, chitChatId } = state
  const chitChatRegex = /\/chit-chat\/\d+/
  const history = useHistory()
  const userOnChitChatPage = Boolean(pathname.match(chitChatRegex))
  const userHasWorkingTech = localStorage.getItem('userHasWorkingTech')

  // subscribe to the Event only if we have an chitChatId
  const { data: chitChatData } = useSubscription(listenToChitChat, {
    variables: {
      event_id: chitChatId,
    },
    skip: !chitChatId,
  })

  useEffect(() => {
    if (userId && userHasWorkingTech) {
      dispatch((draft) => {
        draft.userHasEnabledCameraAndMic = true
      })
    }
  }, [userId, userHasWorkingTech])

  useEffect(() => {
    // if on chitChat page and its a valid chitChat
    if (userOnChitChatPage && chitChatData) {
      // chitChat doesn't exist - redirect user
      if (!chitChatData.events_new.length) {
        setAppLoading(false)
        return history.push('/events-new')
      }

      const eventWasReset =
        chitChat.status &&
        chitChat.status !== 'not-started' &&
        chitChatData.events_new[0].status === 'not-started'
      if (eventWasReset) {
        window.location.reload()
      }
      dispatch((draft) => {
        draft.chitChat = chitChatData.events_new[0]
      })
      return setAppLoading(false)
    }
  }, [chitChatData, dispatch, chitChat, userOnChitChatPage, history])

  return <ChitChatContext.Provider value={[state, dispatch]}>{children}</ChitChatContext.Provider>
}

export { useChitChatContext, ChitChatProvider }
