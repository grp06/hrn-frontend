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
import { updateEventUsersNewLastSeen } from '../gql/mutations'

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

  const setEventNewId = (chitChatId) => {
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
    setEventNewId,
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

  const [updateEventUsersNewLastSeenMutation] = useMutation(updateEventUsersNewLastSeen, {
    variables: {
      chitChatId,
      now: new Date().toISOString(),
      user_id: userId,
    },
    skip: !userId || !chitChatId,
  })

  const { data: onlineChitChatUsersData } = useSubscription(listenToOnlineFansByChitChatId, {
    variables: {
      chitChatId,
    },
    skip: !userId || !chitChatId,
  })

  // check the online user for events
  useEffect(() => {
    if (onlineChitChatUsersData) {
      dispatch((draft) => {
        draft.onlineChitChatUsersArray = onlineChitChatUsersData.online_event_users_new
      })
    }
  }, [onlineChitChatUsersData])

  //
  useEffect(() => {
    if (chitChatRSVPs && userId) {
      const currentUser = chitChatRSVPs.find((eventUser) => eventUser.user_id === userId)
      if (currentUser && currentUser.status === 'completed') {
        console.log('cleared interval ', interval)
        clearInterval(interval)
      }
    }
  }, [chitChatRSVPs, userId])

  useEffect(() => {
    // TODO sending last seen for host but it's not doing anything. Do we need to send for host?
    if (userId && userInChitChatEvent && userHasEnabledCameraAndMic) {
      console.log('GOT INTO LAST SEEN BLOCK')
      interval = setInterval(async () => {
        console.log('last seen')
        try {
          if (!bannedUserIds.includes(userId)) {
            await updateEventUsersNewLastSeenMutation()
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
    if (chitChatRSVPsData && chitChatRSVPsData.event_users_new) {
      dispatch((draft) => {
        draft.chitChatRSVPs = chitChatRSVPsData.event_users_new
      })
    }
  }, [chitChatRSVPsData])

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
