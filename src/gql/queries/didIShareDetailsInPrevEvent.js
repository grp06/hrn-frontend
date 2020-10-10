import gql from 'graphql-tag'

const didIShareDetailsInPrevEvent = gql`
  query didIShareDetailsInPrevEvent($user_id: Int!, $partner_id: Int!) {
    partners(
      where: {
        user_id: { _eq: $user_id }
        partner_id: { _eq: $partner_id }
        i_shared_details: { _eq: true }
      }
    ) {
      i_shared_details
      partner_id
      user_id
    }
  }
`

export default didIShareDetailsInPrevEvent
