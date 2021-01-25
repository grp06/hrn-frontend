import { updateChitChatStatus } from '../gql/mutations'
import { useMutation } from 'react-apollo'

const useChitChatHelpers = () => {
  const [updateChitChatStatusMutation] = useMutation(updateChitChatStatus)
  const startNextChitChat = async ({ chitChatId, userId }) => {
    await updateChitChatStatusMutation({
      variables: {
        chitChatId,
        userId,
        status: 'call-in-progress',
      },
      // onCompleted not working, so I'm doing this https://github.com/apollographql/react-apollo/issues/3781
    })
  }
  return { startNextChitChat }
}

export default useChitChatHelpers
