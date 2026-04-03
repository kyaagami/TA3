import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeDeleteProctoredUserByIdValidation = (): ValidationComposite => {
    return new ValidationComposite([
        new RequiredFieldValidation('id'),
    ], 'params')
}