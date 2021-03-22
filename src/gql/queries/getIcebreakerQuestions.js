import gql from 'graphql-tag'

const getIcebreakerQuestions = gql`
  query getIcebreakerQuestions {
    ice_breakers {
      category
      question
    }
  }
`

export default getIcebreakerQuestions
