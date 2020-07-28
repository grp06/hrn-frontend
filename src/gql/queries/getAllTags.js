import gql from 'graphql-tag'

const getAllTags = gql`
  query getAllTags {
    tags {
      name
      tag_id
      category
    }
  }
`

export default getAllTags
