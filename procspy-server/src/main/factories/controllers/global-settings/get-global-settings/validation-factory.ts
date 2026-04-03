import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeGetGlobalSettingsValidation = (): ValidationComposite => {
    return new ValidationComposite([
        
    ], 'body')
}