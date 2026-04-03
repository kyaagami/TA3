import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeUpdateLogByIdValidation = (): ValidationComposite => {
    return new ValidationComposite([
        new RequiredFieldValidation('logType'),
        new RequiredFieldValidation('id'),
    ], 'body')
}