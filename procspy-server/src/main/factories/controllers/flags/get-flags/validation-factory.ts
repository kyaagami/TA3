import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeGetFlagsValidation = (): ValidationComposite => {
    return new ValidationComposite([
        
    ], 'body')
}