import gql from 'graphql-tag'

const getUnsplashImageURL = gql`
  query getUnsplashImageUrl($keyword: String!) {
    getUnsplashImageUrl(keyword: $keyword) {
      url
    }
  }
`

export default getUnsplashImageURL
