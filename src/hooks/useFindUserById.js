import { useQuery } from '@apollo/react-hooks'

import { useGameContext } from '../context/useGameContext'
import { findMyUser } from '../gql/queries'

const useFindUserById = () => {
  const { userId, setCurrentUserData } = useGameContext()

  const { data } = useQuery(findMyUser, {
    variables: { id: localStorage.getItem('userId') },
  })

  if (data && data.users) {
    setCurrentUserData(data.users[0])
  }

  return null
}

export default useFindUserById
