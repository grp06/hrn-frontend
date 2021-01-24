import gql from 'graphql-tag'

const getChitChatFormDetails = gql`
  query getChitChatFormDetails($chit_chat_id: Int!) {
    events_new(where: { id: { _eq: $chit_chat_id } }) {
      id
      num_rounds
      start_at
      round_length
    }
  }
`

export default getChitChatFormDetails
