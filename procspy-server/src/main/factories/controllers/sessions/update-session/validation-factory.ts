import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { RequiredOneFromTwoFieldValidation } from "@infra/http/validations/RequiredOneFromTwoFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeUpdateSessionValidation = ():ValidationComposite => {
    return new ValidationComposite([
        new RequiredFieldValidation('id'), 
      ], 'body')
}