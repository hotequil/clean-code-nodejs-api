import { Validation } from "@/presentation/protocols";
import { AnyObject } from "@/utils/helpers";

export const mockValidation = (): Validation => {
    class ValidationStub implements Validation{
        validate(value: AnyObject): Error | null {
            console.log(value);

            return null;
        }
    }

    return new ValidationStub()
}
