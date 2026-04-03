import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeGetProctoredUserDetailLogByTokenValidation = (): ValidationComposite => {
    return new ValidationComposite([
        new RequiredFieldValidation('token'),
        // new RequiredFieldValidation('attachment'),
    ], 'params')
}