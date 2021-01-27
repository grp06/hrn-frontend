import gql from 'graphql-tag'

const getChitChatFormDetails = gql`
  query getChitChatFormDetails($chit_chat_id: Int!) {
    chit_chats(where: { id: { _eq: $chit_chat_id } }) {
      id
      num_rounds
      round_length
      start_at
      suggested_donation
    }
  }
`

export default getChitChatFormDetails
