import gql from 'graphql-tag'

const setPartnerYThumb = gql`
  mutation setPartnerYThumb($partnerY_id: Int!, $round_id: Int!) {
    update_rounds(
      where: { id: { _eq: $round_id }, partnerY_id: { _eq: $partnerY_id } }
      _set: { partnerY_thumb: true }
    ) {
      returning {
        partnerY_id
        partnerY_thumb
        id
      }
    }
  }
`
export default setPartnerYThumb
