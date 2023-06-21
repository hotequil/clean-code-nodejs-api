import { gql } from "apollo-server-express";

export default gql`
    scalar Date

    type Query{
        _: String!
    }

    type Mutation{
        _: String!
    }
`
