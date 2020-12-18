import gql from 'graphql-tag'

const insertHostQuestionnaire = gql`
  mutation insertHostQuestionnaire(
    $community_type: String!
    $currently_organize: String!
    $event_frequency: String!
    $user_id: Int!
  ) {
    insert_host_questionnaire(
      objects: {
        community_type: $community_type
        currently_organize: $currently_organize
        event_frequency: $event_frequency
        user_id: $user_id
      }
    ) {
      affected_rows
    }
  }
`
export default insertHostQuestionnaire
