import gql from 'graphql-tag'

const setPartnerXThumb = gql`
  mutation setPartnerXThumb($partnerX_id: Int!, $round_id: Int!) {
    update_rounds(
      where: { id: { _eq: $round_id }, partnerX_id: { _eq: $partnerX_id } }
      _set: { partnerX_thumb: true }
    ) {
      returning {
        partnerX_id
        partnerX_thumb
        id
      }
    }
  }
`
export default setPartnerXThumb
