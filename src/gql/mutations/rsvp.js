import gql from 'graphql-tag'

const rsvp = gql`
  mutation rsvp($id: Int!) {
    update_events(where: { id: { _eq: $id } }, _set: { current_round: 0 }) {
      affected_rows
    }
  }
`
export default rsvp
