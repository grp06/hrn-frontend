import gql from 'graphql-tag'

const updateISharedDetails = gql`
  mutation UpdateISharedDetails($event_id: Int!, $user_id: Int!, $partner_id: Int!) {
    update_partners(
      where: {
        event_id: { _eq: $event_id }
        user_id: { _eq: $user_id }
        partner_id: { _eq: $partner_id }
      }
      _set: { i_shared_details: true }
    ) {
      returning {
        user_id
        event_id
        partner_id
        i_shared_details
      }
    }
  }
`
export default updateISharedDetails
