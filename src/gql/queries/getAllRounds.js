import gql from 'graphql-tag'

const getAllRounds = gql`
  query getAllRounds {
    partners {
      user {
        first_name
        last_name
      }
      partner {
        first_name
        last_name
      }
      event {
        start_at
      }
    }
  }
`

export default getAllRounds
