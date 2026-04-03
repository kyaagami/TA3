import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeCreateFlagValidation = (): ValidationComposite => {
    return new ValidationComposite([
        new RequiredFieldValidation('flagKey'),
        new RequiredFieldValidation('label'),
        new RequiredFieldValidation('severity'),
    ], 'body')
}