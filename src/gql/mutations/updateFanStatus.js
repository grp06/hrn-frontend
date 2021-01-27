import gql from 'graphql-tag'

const updateFanStatus = gql`
  mutation updateFanStatus($userId: Int!, $status: String!) {
    update_chit_chat_users(where: { user_id: { _eq: $userId } }, _set: { status: $status }) {
      returning {
        status
        updated_at
      }
    }
  }
`
export default updateFanStatus
