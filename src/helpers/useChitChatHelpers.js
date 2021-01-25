import { updateChitChatStatus, updateFanStatus } from '../gql/mutations'
import { useMutation } from 'react-apollo'

const useChitChatHelpers = () => {
  const [updateChitChatStatusMutation] = useMutation(updateChitChatStatus)
  const [updateFanStatusMutation] = useMutation(updateFanStatus)
  const startNextChitChat = async ({ onlineFansData, chitChatId, userId }) => {
    try {
      await updateChitChatStatusMutation({
        variables: {
          chitChatId,
          userId,
          status: 'call-in-progress',
        },
      })
      const firstFanToMeet = onlineFansData.online_event_users_new[0].user_id

      await updateFanStatusMutation({
        variables: {
          userId: firstFanToMeet,
          status: 'in-chat',
        },
      })
    } catch (error) {
      console.log('error = ', error)
    }
  }
  return { startNextChitChat }
}

export default useChitChatHelpers
