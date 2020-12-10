import gql from 'graphql-tag'

const getHostQuestionnaire = gql`
  query getHostQuestionnaire($user_id: Int!) {
    host_questionnaire(where: { user_id: { _eq: $user_id } }) {
      id
    }
  }
`

export default getHostQuestionnaire
