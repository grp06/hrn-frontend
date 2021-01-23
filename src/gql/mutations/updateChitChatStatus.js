import gql from 'graphql-tag'

const updateChitChatStatus = gql`
  mutation updateChitChatStatus($chitChatId: Int!, $userId: Int!, $status: String!) {
    update_events_new(
      where: { id: { _eq: $chitChatId }, host_id: { _eq: $userId } }
      _set: { status: $status }
    ) {
      returning {
        status
      }
    }
  }
`
export default updateChitChatStatus
