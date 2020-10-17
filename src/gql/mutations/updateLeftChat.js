import gql from 'graphql-tag'

const updateLeftChat = gql`
  mutation leaveChat($row_id: Int!, $reason: String!, $rating: Int) {
    update_partners(
      _set: { left_chat: $reason, rating: $rating }
      where: { id: { _eq: $row_id } }
    ) {
      affected_rows
    }
  }
`
export default updateLeftChat
