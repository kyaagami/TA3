import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeUpdateGlobalSettingValidation = (): ValidationComposite => {
    return new ValidationComposite([
        new RequiredFieldValidation('key'),
        new RequiredFieldValidation('value'),
    ], 'body')
}