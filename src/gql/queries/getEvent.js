import gql from 'graphql-tag'

const getEvent = gql`
  query getEvent($id: Int) {
    events(where: { id: { _eq: $id } }) {
      id
      host_id
    }
  }
`

export default getEvent
