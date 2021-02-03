import React, { useEffect, createContext, useContext } from 'react'

import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory } from 'react-router-dom'
import { useAppContext, useUserContext } from '.'
import {
  listenToChitChat,
  listenToChitChatRSVPs,
  listenToOnlineFansByChitChatId,
} from '../gql/subscriptions'
import { updateChitChatUsersLastSeen } from '../gql/mutations'

import { constants } from '../utils'

const { lastSeenDuration, bannedUserIds } = constants
const ChitChatContext = createContext()

// types of status for event-new include
// 1) not-started
// 2) call-in-progress
// 3) paused
// 4) completed
const defaultState = {
  // chitChatId is for chitChat subscriptions
  chitChat: {},
  chitChatId: null,
  chitChatRSVPs: null,
  fanNeverConnected: false,
  fanDisconnectedFromChat: false,
  onlineChitChatUsersArray: [],
  userHasEnabledCameraAndMic: true,
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

  const setChitChatId = (chitChatId) => {
    dispatch((draft) => {
      draft.chitChatId = chitChatId
    })
  }

  const setFanNeverConnected = (didFanEverConnect) => {
    dispatch((draft) => {
      draft.fanNeverConnected = didFanEverConnect
    })
  }

  const setFanDisconnectedFromChat = (didFanDisconnect) => {
    dispatch((draft) => {
      draft.fanDisconnectedFromChat = didFanDisconnect
    })
  }

  return {
    ...state,
    resetEventNew,
    setChitChatId,
    setFanNeverConnected,
    setFanDisconnectedFromChat,
    setUserHasEnabledCameraAndMic,
  }
}
let interval

const ChitChatProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const { setAppLoading } = useAppContext()
  const { user, userInChitChatEvent } = useUserContext()
  const { id: userId } = user

  const { pathname } = window.location
  const { chitChat, chitChatId, chitChatRSVPs, userHasEnabledCameraAndMic } = state
  const { status: eventStatus } = chitChat
  const chitChatRegex = /\/chit-chat\/\d+/
  const history = useHistory()
  const userOnChitChatPage = Boolean(pathname.match(chitChatRegex))

  const currentUser =
    chitChatRSVPs && chitChatRSVPs.find((eventUser) => eventUser.user_id === userId)

  const currentUserStatus = currentUser ? currentUser.status : null

  // subscribe to the Event only if we have an chitChatId
  const { data: chitChatData } = useSubscription(listenToChitChat, {
    variables: {
      event_id: chitChatId,
    },
    skip: !chitChatId,
  })

  const { data: chitChatRSVPsData } = useSubscription(listenToChitChatRSVPs, {
    variables: {
      chitChatId,
    },
    skip: !chitChatId,
  })

  const [updateChitChatUsersLastSeenMutation] = useMutation(updateChitChatUsersLastSeen, {
    variables: {
      chitChatId,
      now: currentUserStatus === 'in-chat' ? null : new Date().toISOString(),
      user_id: userId,
    },
    skip: !userId || !chitChatId,
  })

  const { data: onlineChitChatUsersData } = useSubscription(listenToOnlineFansByChitChatId, {
    variables: {
      chitChatId,
    },
    skip: !chitChatId,
  })

  // check the online user for events
  useEffect(() => {
    if (onlineChitChatUsersData) {
      dispatch((draft) => {
        draft.onlineChitChatUsersArray = onlineChitChatUsersData.online_chit_chat_users
      })
    }
  }, [onlineChitChatUsersData])

  //
  useEffect(() => {
    if (userId && currentUserStatus) {
      if (currentUserStatus === 'in-chat') {
        history.push(`/chit-chat/${chitChatId}/video-room`)
        clearInterval(interval)
      }
      if (currentUserStatus === 'completed') {
        clearInterval(interval)
      }
    }
  }, [currentUserStatus, userId])

  useEffect(() => {
    // TODO sending last seen for host but it's not doing anything. Do we need to send for host?
    if (userId && userInChitChatEvent && userHasEnabledCameraAndMic) {
      console.log('GOT INTO LAST SEEN BLOCK')
      interval = setInterval(async () => {
        console.log('last seen')
        try {
          if (!bannedUserIds.includes(userId)) {
            await updateChitChatUsersLastSeenMutation()
          }
        } catch (error) {
          console.log('interval -> error', error)
        }
      }, lastSeenDuration)
      return () => {
        clearInterval(interval)
      }
    }
  }, [userId, userInChitChatEvent, userHasEnabledCameraAndMic])

  useEffect(() => {
    if (chitChatRSVPsData && chitChatRSVPsData.chit_chat_users) {
      dispatch((draft) => {
        draft.chitChatRSVPs = chitChatRSVPsData.chit_chat_users
      })
    }
  }, [chitChatRSVPsData])

  useEffect(() => {
    // if on chitChat page and its a valid chitChat
    if (userOnChitChatPage && chitChatData) {
      // chitChat doesn't exist - redirect user
      if (!chitChatData.chit_chats.length) {
        setAppLoading(false)
        return history.push('/creator-home')
      }

      const eventWasReset =
        chitChat.status &&
        chitChat.status !== 'not-started' &&
        chitChatData.chit_chats[0].status === 'not-started'
      if (eventWasReset) {
        window.location.reload()
      }
      dispatch((draft) => {
        draft.chitChat = chitChatData.chit_chats[0]
      })
      return setAppLoading(false)
    }
  }, [chitChatData, dispatch, chitChat, userOnChitChatPage, history])

  return <ChitChatContext.Provider value={[state, dispatch]}>{children}</ChitChatContext.Provider>
}

export { useChitChatContext, ChitChatProvider }
