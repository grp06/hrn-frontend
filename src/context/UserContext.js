import React, { useEffect, useState, createContext, useContext } from 'react'
import { useImmer } from 'use-immer'
import { useHistory, useLocation } from 'react-router-dom'
import { useAppContext } from '.'
import { getUserById, getUserNewById } from '../helpers'
const UserContext = createContext()

const defaultState = {
  user: {
    tags_users: [],
  },
  userInChitChatEvent: false,
  userInEvent: false,
  userOnAuthRoute: false,
}

const useUserContext = () => {
  const [state, dispatch] = useContext(UserContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const resetUser = () => {
    dispatch((draft) => {
      // TODO MAX if we really need to individually set properties, we can
      // but it seems setting the empty object does the trick
      draft.user = {}
    })
  }

  const setUsersTags = (usersTags) => {
    dispatch((draft) => {
      draft.user.tags_users = usersTags
    })
  }

  const setUserUpdatedAt = (updatedAt) => {
    dispatch((draft) => {
      console.log('Date.now === in context', Date.now())
      draft.user.updated_at = updatedAt
    })
  }

  // TODO we gotta actually use this function somewhere
  const setUserInChitChatEvent = (boolean) => {
    console.log('🚀 ~ setUserInChitChatEvent ~ boolean', boolean)
    dispatch((draft) => {
      draft.userInChitChatEvent = boolean
    })
  }

  const setUserInEvent = (boolean) => {
    dispatch((draft) => {
      draft.userInEvent = boolean
    })
  }

  const updateUserObject = (userObject) => {
    dispatch((draft) => {
      draft.user.name = userObject.name
      draft.user.city = userObject.city
      draft.user.short_bio = userObject.short_bio
      draft.user.linkedIn_url = userObject.linkedIn_url
    })
  }

  const updateUserNewObject = (userObject) => {
    dispatch((draft) => {
      draft.user.cash_app = userObject.cash_app
      draft.user.email = userObject.email
      draft.user.name = userObject.name
      draft.user.venmo = userObject.venmo
      draft.user.profile_pic_url = userObject.profile_pic_url
    })
  }

  return {
    ...state,
    resetUser,
    setUsersTags,
    setUserUpdatedAt,
    updateUserObject,
    updateUserNewObject,
    setUserInChitChatEvent,
    setUserInEvent,
  }
}

const UserProvider = ({ children }) => {
  const [state, dispatch] = useImmer(defaultState)
  const { setAppLoading } = useAppContext()
  const history = useHistory()
  const location = useLocation()
  const { userId } = state.user
  const { pathname } = location
  const [userData, setUserData] = useState(null)
  const specificEventPageRegex = /\/events\/\d+[\/]?$/
  const eventsPageRegex = /\/events[\/]?$/
  const specificChitChatPageRegex = /\/chit-chat\/\d+[\/]?$/
  const setNewPasswordPageRegex = /set-new-password/

  const userOnSpecificEventPage = Boolean(pathname.match(specificEventPageRegex))
  const userOnEventsPage = Boolean(pathname.match(eventsPageRegex))
  // any reason to use a regex below? We really just to know if they're on a chit-chat page
  const userOnSpecificChitChatPage = Boolean(pathname.includes('/chit-chat'))
  const userOnSetNewPasswordPage = Boolean(pathname.match(setNewPasswordPageRegex))
  const userOnSignUpPage = Boolean(pathname.includes('sign-up'))
  const userOnLoginNewPage = Boolean(pathname.includes('login-new'))
  const userOnSubscriptionPage = Boolean(pathname.includes('/subscription'))

  const eventRoutes = ['video-room', 'lobby', 'group-vide-chat']

  const userInEvent = eventRoutes.some((route) => pathname.includes(route))

  const authRoutes = [
    'sign-up',
    'forgot-password',
    'set-new-password',
    'onboarding',
    'host-onboarding',
    'checkout-success',
    'sign-up-new',
    'login-new',
  ]

  const isUserOnAuth = pathname === '/' || authRoutes.some((route) => pathname.includes(route))

  useEffect(() => {
    const role = localStorage.getItem('role')
    const getUserWrapper = async () => {
      const userDataRes =
        role === 'fan' || role === 'celeb'
          ? await getUserNewById({ userId })
          : await getUserById({ userId })
      setUserData(userDataRes.userObj)
    }
    if (userId) {
      try {
        getUserWrapper()
      } catch (error) {
        console.log('error = ', error)
      }
    }
  }, [userId])

  // Setting the user state in context after findUserById Query is made
  useEffect(() => {
    if (userData) {
      dispatch((draft) => {
        // TODO: check why Immer isn't making a deep clone of user object
        draft.user = { ...draft.user, ...userData }
        draft.userInEvent = userInEvent
      })
      return setAppLoading(false)
    }
  }, [userData, userId])

  useEffect(() => {
    if (location) {
      console.log('userOnSpecificChitChatPage = ', userOnSpecificChitChatPage)
      dispatch((draft) => {
        draft.userOnAuthRoute = isUserOnAuth
        draft.userInEvent = userInEvent
        draft.userInChitChatEvent = userOnSpecificChitChatPage
      })
    }
  }, [location])

  // once we get on the app check to see if theres a userID in local storage
  // if there is then we want to set user.userId so that findByUserId query can be called
  // if not:
  // if we're on /events of /events/:id then do nothing
  // otherwise redirect back to /login
  useEffect(() => {
    const localStorageUserId = localStorage.getItem('userId')

    if (!localStorageUserId) {
      if (
        !(
          userOnEventsPage ||
          userOnSpecificEventPage ||
          userOnSpecificChitChatPage ||
          userOnSetNewPasswordPage ||
          userOnSignUpPage ||
          userOnSubscriptionPage ||
          userOnLoginNewPage
        )
      ) {
        history.push('/')
      }
    } else {
      dispatch((draft) => {
        draft.user.userId = parseInt(localStorageUserId, 10)
      })
    }
  }, [])

  return <UserContext.Provider value={[state, dispatch]}>{children}</UserContext.Provider>
}

export { useUserContext, UserProvider }
