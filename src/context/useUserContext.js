import { useContext } from 'react'

import { UserContext } from './UserProvider'

const useUserContext = () => {
  const [state, dispatch] = useContext(UserContext)

  if (dispatch === undefined) {
    throw new Error('Must have dispatch defined')
  }

  const resetUser = () => {
    dispatch((draft) => {
      draft.user = {
        name: '',
        userId: null,
        role: '',
        city: '',
        shortBio: '',
        linkedIn_url: '',
        tags_users: [],
      }
    })
  }

  const setUsersTags = (usersTags) => {
    dispatch((draft) => {
      draft.user.tags_users = usersTags
    })
  }

  const setUserUpdatedAt = (updatedAt) => {
    dispatch((draft) => {
      draft.user.updated_at = updatedAt
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

  return {
    ...state,
    resetUser,
    setUsersTags,
    setUserUpdatedAt,
    updateUserObject,
    setUserInEvent,
  }
}

export default useUserContext
