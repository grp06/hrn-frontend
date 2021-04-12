import gql from 'graphql-tag'

const insertOrganization = gql`
  mutation insertOrganization($org_object: [organizations_insert_input!]!) {
    insert_organizations(objects: $org_object) {
      returning {
        creator_id
        department
        id
        name
        team_size
      }
    }
  }
`
export default insertOrganization
