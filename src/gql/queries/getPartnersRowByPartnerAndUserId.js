import gql from 'graphql-tag'

const getPartnersRowByPartnerAndUserId = gql`
  query getPartnersRowByPartnerAndUserId(
    $event_id: Int!
    $partner_id: Int!
    $round: Int!
    $user_id: Int!
  ) {
    partners(
      where: {
        event_id: { _eq: $event_id }
        partner_id: { _eq: $partner_id }
        round: { _eq: $round }
        user_id: { _eq: $user_id }
      }
    ) {
      event_id
      id
      partner_id
      round
      user_id
    }
  }
`

export default getPartnersRowByPartnerAndUserId
