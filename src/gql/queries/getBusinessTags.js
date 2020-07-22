import gql from 'graphql-tag'

const getSocialTags = gql`
  query getBusinessTags {
    tags(where: { _and: { id: { _gte: 201, _lte: 400 } } }) {
      name
      id
    }
  }
`

export default getSocialTags
