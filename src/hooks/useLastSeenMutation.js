import { useMutation } from '@apollo/react-hooks'
import { updateLastSeen } from '../gql/mutations'
import { constants } from '../utils'

const { lastSeenDuration } = constants

const useLastSeenMutation = (userId, setUserUpdatedAt) => {
  const [updateLastSeenMutation] = useMutation(updateLastSeen, {
    variables: {
      now: new Date().toISOString(),
      id: userId,
    },
    skip: !userId,
  })

  const lastSeenMutation = (permissions, userSittingOut) => {
    if (
      !userSittingOut &&
      permissions.isWebcamAlreadyCaptured &&
      permissions.isMicrophoneAlreadyCaptured
    ) {
      window.lastSeenInterval = setInterval(async () => {
        console.log('last seen')
        try {
          const lastSeenUpdated = await updateLastSeenMutation()
          setUserUpdatedAt(lastSeenUpdated.data.update_users.returning[0].updated_at)
        } catch (error) {
          console.log('interval -> error', error)
        }
      }, lastSeenDuration)
    } else {
      clearInterval(window.lastSeenInterval)
    }
  }
  return { lastSeenMutation }
}

export default useLastSeenMutation
