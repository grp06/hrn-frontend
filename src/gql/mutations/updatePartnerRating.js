import gql from 'graphql-tag'

const updatePartnerRating = gql`
  mutation updatePartnerRating($event_id: Int!, $user_id: Int!, $partner_id: Int!, $rating: Int!) {
    update_partners(
      where: {
        event_id: { _eq: $event_id }
        user_id: { _eq: $user_id }
        partner_id: { _eq: $partner_id }
      }
      _set: { rating: $rating }
    ) {
      returning {
        rating
        partner_id
        event_id
        user_id
      }
    }
  }
`
export default updatePartnerRating
