import { type AnyObject } from "@/utils/helpers";

export interface Validation {
    validate: (value: AnyObject) => Error | null
}
