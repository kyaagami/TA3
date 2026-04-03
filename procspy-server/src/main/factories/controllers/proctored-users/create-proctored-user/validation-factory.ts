import { EmailValidation } from "@infra/http/validations/EmailValidation"
import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"
import { EmailvalidatorAdapter } from "@infra/http/validators/EmailValidatorAdapter"

export const makeCreateProctoredUserValidation = (): ValidationComposite => {
    const emailValidator = new EmailvalidatorAdapter()

    return new ValidationComposite([
        new RequiredFieldValidation('name'),
        new RequiredFieldValidation('email'),
        new RequiredFieldValidation('identifier'),
        new EmailValidation('email', emailValidator)
    ], 'body')
}