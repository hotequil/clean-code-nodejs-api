import { typeDefs } from "graphql-scalars";
import base from "./base"
import account from "./account"
import survey from "./survey"

export default [...typeDefs, base, account, survey]
