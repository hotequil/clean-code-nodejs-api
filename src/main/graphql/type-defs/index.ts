import { typeDefs } from "graphql-scalars";
import base from "./base"
import account from "./account"
import survey from "./survey"
import surveyResult from "./survey-result"

export default [...typeDefs, base, account, survey, surveyResult]
