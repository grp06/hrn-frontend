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

  const setUserId = (userId) => {
    dispatch((draft) => {
      draft.user.userId = userId
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
    setUserId,
    updateUserObject,
  }
}

export default useUserContext
