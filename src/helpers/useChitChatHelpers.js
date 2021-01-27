import { updateChitChatStatus, updateFanStatus } from '../gql/mutations'
import { useMutation } from 'react-apollo'

const useChitChatHelpers = () => {
  const [updateChitChatStatusMutation] = useMutation(updateChitChatStatus)
  const [updateFanStatusMutation] = useMutation(updateFanStatus)

  const startNextChitChat = async ({ onlineChitChatUsersArray, chitChatId, userId }) => {
    try {
      await updateChitChatStatusMutation({
        variables: {
          chitChatId,
          status: 'call-in-progress',
        },
        // onCompleted not working, so I'm doing this https://github.com/apollographql/react-apollo/issues/3781
      })
      const nextFanToMeet = onlineChitChatUsersArray[0].user_id

      await updateFanStatusMutation({
        variables: {
          userId: nextFanToMeet,
          status: 'in-chat',
        },
      })
    } catch (error) {
      console.log('🚀 ~ startNextChitChat ~ error', error)
    }
  }

  const resetChitChat = async ({ onlineChitChatUsersArray, chitChatId, userId }) => {
    try {
      const fanCurrentlyInChat = onlineChitChatUsersArray.find(
        (eventUser) => eventUser.status === 'in-chat' || eventUser.status == 'completed'
      ).user_id

      await updateFanStatusMutation({
        variables: {
          userId: fanCurrentlyInChat,
          status: 'in-queue',
        },
      })

      await updateChitChatStatusMutation({
        variables: {
          chitChatId,
          status: 'not-started',
        },
        // onCompleted not working, so I'm doing this https://github.com/apollographql/react-apollo/issues/3781
      })
    } catch (error) {
      console.log('🚀 ~ resetChitChat ~ error', error)
    }
  }

  const endCall = async ({ onlineChitChatUsersArray, chitChatId, userId, chitChatRSVPs }) => {
    try {
      const currentFanChatting = onlineChitChatUsersArray.find(
        (eventUser) => eventUser.status === 'in-chat'
      )

      await updateFanStatusMutation({
        variables: {
          userId: currentFanChatting.user_id,
          status: 'completed',
        },
      })

      const wasFinalFan =
        chitChatRSVPs[chitChatRSVPs.length - 1].user_id === currentFanChatting.user_id

      await updateChitChatStatusMutation({
        variables: {
          chitChatId,
          status: wasFinalFan ? 'completed' : 'paused',
        },
      })
    } catch (error) {
      console.log('🚀 ~ endCall ~ error', error)
    }
  }

  return { startNextChitChat, resetChitChat, endCall }
}

export default useChitChatHelpers
