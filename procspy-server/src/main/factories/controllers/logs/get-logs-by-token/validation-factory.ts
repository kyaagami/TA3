import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeGetLogsByTokenValidation = (): ValidationComposite => {
    return new ValidationComposite([
        new RequiredFieldValidation('token'),
    ], 'params')
}