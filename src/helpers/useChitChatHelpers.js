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
          userId,
          status: 'call-in-progress',
        },
        // onCompleted not working, so I'm doing this https://github.com/apollographql/react-apollo/issues/3781
      })
      const firstFanToMeet = onlineChitChatUsersArray[0].user_id

      await updateFanStatusMutation({
        variables: {
          userId: firstFanToMeet,
          status: 'in-chat',
        },
      })
    } catch (error) {
      console.log('🚀 ~ startNextChitChat ~ error', error)
    }
  }

  const resetChitChat = async ({ onlineChitChatUsersArray, chitChatId, userId }) => {
    console.log('🚀 ~ resetChitChat ~ userId', userId)
    console.log('🚀 ~ resetChitChat ~ chitChatId', chitChatId)
    try {
      const fanCurrentlyInChat = onlineChitChatUsersArray.find(
        (eventUser) => eventUser.status === 'in-chat'
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
          userId,
          status: 'not-started',
        },
        // onCompleted not working, so I'm doing this https://github.com/apollographql/react-apollo/issues/3781
      })
    } catch (error) {
      console.log('🚀 ~ resetChitChat ~ error', error)
    }
  }

  return { startNextChitChat, resetChitChat }
}

export default useChitChatHelpers
