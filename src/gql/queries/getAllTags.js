import gql from 'graphql-tag'

const getAllTags = gql`
  query getAllTags {
    tags {
      name
      id
    }
  }
`

export default getAllTags
