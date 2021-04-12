import gql from 'graphql-tag'

const findOrgByNameAndDepartment = gql`
  query findOrgByNameAndDepartment($org_name: String!, $department: String!) {
    organizations(where: { department: { _eq: $department }, name: { _eq: $org_name } }) {
      id
    }
  }
`

export default findOrgByNameAndDepartment
