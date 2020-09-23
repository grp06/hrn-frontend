import gql from 'graphql-tag'

const getAllPartnersForRound = gql`
  query getAllPartnersForRound($event_id: Int!, $round: Int!) {
    partners(where: { event_id: { _eq: $event_id }, round: { _eq: $round } }) {
      id
    }
  }
`

export default getAllPartnersForRound
