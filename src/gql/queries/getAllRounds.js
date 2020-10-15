import gql from 'graphql-tag'

const getAllRounds = gql`
  query getAllRounds {
    partners {
      user {
        name
      }
      partner {
        name
      }
      event {
        start_at
      }
    }
  }
`

export default getAllRounds
