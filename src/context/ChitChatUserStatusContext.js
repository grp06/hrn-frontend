import React, { useEffect, createContext, useContext } from 'react'

import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useImmer } from 'use-immer'
import { useHistory } from 'react-router-dom'
import { useUserContext } from '.'
import { useChitChatContext } from './ChitChatContext'
import { updateEventUsersNewLastSeen } from '../gql/mutations'
import { constants } from '../utils'
import { listenToOnlineFansByChitChatId } from '../gql/subscriptions'

const { lastSeenDuration, bannedUserIds } = constants

const ChitChatUserStatusContext = createContext()

// status could be
// in-queue
// in-chat
// completed
// skipped
const defaultState = {
  chitChatUserStatus: 'in-queue',
  onlineChitChatUsersArray: [],
  userHasEnabledCameraAndMic: false,
}

const useChitChatUserStatusContext = () => {
  const [state, dispatch] = useContext(ChitChatUserStatusContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const setUserEventStatus = (status) => {
    console.log('setUSerEventStatus ->', status)
    dispatch((draft) => {
      draft.userEventStatus = status
    })
  }

  const setUserHasEnabledCameraAndMic = (userHasEnabledCameraAndMic) => {
    dispatch((draft) => {
      draft.userHasEnabledCameraAndMic = userHasEnabledCameraAndMic
    })
  }

  return {
    ...state,
    setUserEventStatus,
    setUserHasEnabledCameraAndMic,
  }
}

const ChitChatUserStatusProvider = ({ children }) => {
  const [state, dispatch] = useImmer({ ...defaultState })
  const { chitChatUserStatus, userHasEnabledCameraAndMic } = state
  const { user, setUserUpdatedAt, userInChitChatEvent } = useUserContext()
  const { chitChat } = useChitChatContext()
  const { host_id: hostId } = chitChat

  const { id: chitChatId } = chitChat
  const { id: userId } = user

  const userIsHost = parseInt(hostId, 10) === parseInt(userId, 10)

  const history = useHistory()

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
    skip: !chitChatId,
  })

  // check if need to push to chitChatComplete
  // TODO create chitChatComplete page
  useEffect(() => {
    if (chitChatUserStatus === 'completed') {
      history.push(`/chit-chat/${chitChatId}`)
    }
  }, [chitChatUserStatus])

  // check the online user for events
  useEffect(() => {
    if (onlineChitChatUsersData) {
      dispatch((draft) => {
        draft.onlineChitChatUsersArray = onlineChitChatUsersData.online_event_users_new
      })
    }
  }, [onlineChitChatUsersData])

  // update last_seen on the user object every X seconds so users show up as "online" for host
  // make sure we've got a hostId, and the the user is not the host before starting the interval
  useEffect(() => {
    if (
      userId &&
      chitChatUserStatus === 'in-queue' &&
      userInChitChatEvent &&
      hostId &&
      !userIsHost
    ) {
      console.log('🚀 ~ useEffect ~ userIsHost', userIsHost)
      const interval = setInterval(async () => {
        console.log('last seen')
        try {
          if (!bannedUserIds.includes(userId)) {
            const lastSeenUpdated = await updateEventUsersNewLastSeenMutation()
            setUserUpdatedAt(lastSeenUpdated.data.update_event_users_new.returning[0].last_seen)
          }
        } catch (error) {
          console.log('interval -> error', error)
        }
      }, lastSeenDuration)
      return () => {
        clearInterval(interval)
      }
    }
  }, [userId, chitChatUserStatus, userInChitChatEvent])

  return (
    <ChitChatUserStatusContext.Provider value={[state, dispatch]}>
      {children}
    </ChitChatUserStatusContext.Provider>
  )
}

export { useChitChatUserStatusContext, ChitChatUserStatusProvider }
