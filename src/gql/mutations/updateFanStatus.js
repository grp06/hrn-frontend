import gql from 'graphql-tag'

const updateFanStatus = gql`
  mutation updateFanStatus($userId: Int!, $status: String!) {
    update_event_users_new(where: { user_id: { _eq: $userId } }, _set: { status: $status }) {
      returning {
        status
        updated_at
      }
    }
  }
`
export default updateFanStatus
