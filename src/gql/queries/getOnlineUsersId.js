import gql from 'graphql-tag'

const getOnlineUsersId = gql`
  query getOnlineUsersId {
    online_users {
      id
    }
  }
`

export default getOnlineUsersId
