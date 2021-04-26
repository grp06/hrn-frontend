import gql from 'graphql-tag'

const findUsersCreatedBetweenTwoDates = gql`
  query findUsersCreatedBetweenTwoDates($from: timestamptz!, $to: timestamptz!) {
    users(where: { _and: [{ created_at: { _gt: $from } }, { created_at: { _lt: $to } }] }) {
      id
      first_name
      last_name
      role
      created_at
    }
  }
`

export default findUsersCreatedBetweenTwoDates
