import { updateChitChatStatus, updateFanStatus } from '../gql/mutations'
import { useMutation } from 'react-apollo'
import { sendEventStartedReminder, sendReminderToUpcomingParticipants } from '.'

const useChitChatHelpers = () => {
  const [updateChitChatStatusMutation] = useMutation(updateChitChatStatus)
  const [updateFanStatusMutation] = useMutation(updateFanStatus)

  const startNextChitChat = async ({
    onlineChitChatUsersArray,
    chitChatId,
    startOfEvent,
    chitChatRSVPs,
    chitChat,
  }) => {
    try {
      await updateChitChatStatusMutation({
        variables: {
          chitChatId,
          status: 'call-in-progress',
        },
        // onCompleted not working, so I'm doing this https://github.com/apollographql/react-apollo/issues/3781
      })
      const userIdOfNextFanToMeet = onlineChitChatUsersArray[0].user_id
      console.log('🚀 ~ useChitChatHelpers ~ userIdOfNextFanToMeet', userIdOfNextFanToMeet)

      await updateFanStatusMutation({
        variables: {
          userId: userIdOfNextFanToMeet,
          status: 'in-chat',
        },
      })

      await sendReminderToUpcomingParticipants({ chitChatRSVPs, chitChat })

      if (startOfEvent) {
        await sendEventStartedReminder({ chitChatRSVPs, chitChat })
      }
    } catch (error) {
      console.log('🚀 ~ startNextChitChat ~ error', error)
    }
  }

  const resetChitChat = async ({ chitChatId, chitChatRoom, chitChatRSVPs }) => {
    try {
      const userIdOfFanCurrentlyInChat = chitChatRSVPs.find(
        (eventUser) => eventUser.status === 'in-chat' || eventUser.status == 'completed'
      ).user_id
      chitChatRoom.disconnect()
      await updateFanStatusMutation({
        variables: {
          userId: userIdOfFanCurrentlyInChat,
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

  const endCall = async ({ chitChatId, chitChatRSVPs }) => {
    try {
      const currentFanChatting = chitChatRSVPs.find((eventUser) => eventUser.status === 'in-chat')

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
