import { resolvers } from "graphql-scalars"
import account from "./account"
import survey from "./survey"
import surveyResult from "./survey-result"

export default [resolvers, account, survey, surveyResult]
