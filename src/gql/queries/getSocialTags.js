import gql from 'graphql-tag'

const getSocialTags = gql`
  query getSocialTags {
    tags(where: { _and: { id: { _gte: 0, _lte: 200 } } }) {
      name
      id
    }
  }
`

export default getSocialTags
