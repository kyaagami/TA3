import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeGetSessionsProctoredUserIdValidation = (): ValidationComposite => {
    return new ValidationComposite([
        new RequiredFieldValidation('proctoredUserId'),
    ], 'params')
}