import { gql } from "apollo-server-express";

export default gql`
    extend type Query{
        surveyResult(surveyId: String!): SurveyResult! @auth
    }
    
    extend type Mutation{
        saveSurveyResult(surveyId: ID!, answer: String!): SurveyResult! @auth
    }

    type SurveyAnswerResult{
        answer: String!
        count: Int!
        percent: Int!
        isCurrentAccountAnswer: Boolean!
        image: String
    }
    
    type SurveyResult{
        surveyId: ID!
        question: String!
        answers: [SurveyAnswerResult!]!
        date: Date!
    }
`
