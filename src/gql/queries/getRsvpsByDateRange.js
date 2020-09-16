import gql from 'graphql-tag'

const getRsvpsByDateRange = gql`
  query getRsvpsByDateRange($startDate: timestamptz!, $endDate: timestamptz!) {
    event_users(
      where: { event: { start_at: { _gt: $startDate }, _and: { start_at: { _lt: $endDate } } } }
      distinct_on: user_id
    ) {
      id
      user {
        name
        email
      }
      event {
        event_name
      }
    }
  }
`

export default getRsvpsByDateRange
