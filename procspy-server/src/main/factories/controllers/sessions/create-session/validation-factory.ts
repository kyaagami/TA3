import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeCreateSessionValidation = (): ValidationComposite => {
    return new ValidationComposite([
        new RequiredFieldValidation('roomId'),
        new RequiredFieldValidation('proctoredUserId'),
    ], 'body')
}