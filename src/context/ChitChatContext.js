import React, { useEffect, createContext, useContext } from 'react'

import { useSubscription } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory } from 'react-router-dom'
import { useAppContext } from '.'
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

  const setEventNewId = (chitChatId) => {
    dispatch((draft) => {
      draft.chitChatId = chitChatId
    })
  }

  return {
    ...state,
    resetEventNew,
    setEventNewId,
  }
}

const ChitChatProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const { setAppLoading } = useAppContext()
  const { pathname } = window.location
  const { chitChat, chitChatId } = state
  const chitChatRegex = /\/chit-chat\/\d+/
  const history = useHistory()
  const userOnChitChatPage = Boolean(pathname.match(chitChatRegex))
  const userOnLobbyOrGroupChat = pathname.includes('lobby')

  console.log('chitChat ->', chitChat)
  // subscribe to the Event only if we have an chitChatId
  const { data: chitChatData } = useSubscription(listenToChitChat, {
    variables: {
      event_id: chitChatId,
    },
    skip: !chitChatId,
  })

  useEffect(() => {
    // if on chitChat page and its a valid chitChat
    if (userOnChitChatPage && chitChatData) {
      // chitChat doesn't exist - redirect user
      if (!chitChatData.events_new.length) {
        setAppLoading(false)
        return history.push('/events-new')
      }
      // cases to set chitChat data:
      // 1) no chitChat data set yet
      // 2) incoming data from subscription is different from existing
      const existingData = JSON.stringify(chitChat)
      const incomingData = JSON.stringify(chitChatData.events_new[0])

      if (existingData !== incomingData) {
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
    }
  }, [chitChatData, dispatch, chitChat, userOnChitChatPage, history])

  return <ChitChatContext.Provider value={[state, dispatch]}>{children}</ChitChatContext.Provider>
}

export { useChitChatContext, ChitChatProvider }
