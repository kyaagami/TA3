import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeCreateLogByTokenValidation = (): ValidationComposite => {
    return new ValidationComposite([
        // new RequiredFieldValidation('attachment'),
        new RequiredFieldValidation('flagKey'),
        new RequiredFieldValidation('token'),
    ], 'body')
}