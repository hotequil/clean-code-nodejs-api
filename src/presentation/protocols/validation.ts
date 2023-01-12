import { AnyObject } from "@/utils/helpers";

export interface Validation {
    validate: (value: AnyObject) => Error|null
}
