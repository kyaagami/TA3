import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeUpdateProctoredUserValidation = (): ValidationComposite => {
    return new ValidationComposite([
        new RequiredFieldValidation('id'),
        new RequiredFieldValidation('identifier'),
        new RequiredFieldValidation('name'),
        new RequiredFieldValidation('email'),
    ], 'body')
}