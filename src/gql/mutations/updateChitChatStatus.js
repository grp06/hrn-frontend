import gql from 'graphql-tag'

const updateChitChatStatus = gql`
  mutation updateChitChatStatus($chitChatId: Int!, $status: String!) {
    update_chit_chats(where: { id: { _eq: $chitChatId } }, _set: { status: $status }) {
      returning {
        status
        updated_at
      }
    }
  }
`
export default updateChitChatStatus
