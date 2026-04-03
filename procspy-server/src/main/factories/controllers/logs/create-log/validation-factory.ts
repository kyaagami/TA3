import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeCreateLogValidation = (): ValidationComposite => {
    return new ValidationComposite([
        new RequiredFieldValidation('sessionId'),
        new RequiredFieldValidation('attachment'),
    ], 'body')
}