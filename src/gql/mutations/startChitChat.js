import gql from 'graphql-tag'

const startChitChat = gql`
  mutation startChitChat($id: Int!, $userId: Int!) {
    update_events_new(
      where: { id: { _eq: $id }, host_id: { _eq: $userId } }
      _set: { status: "call-in-progress" }
    ) {
      returning {
        status
      }
    }
  }
`
export default startChitChat
