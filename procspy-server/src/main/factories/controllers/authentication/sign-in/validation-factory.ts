import { Validation } from "../../../../../infra/http/interfaces/Validation";
import { EmailValidation } from "../../../../../infra/http/validations/EmailValidation";
import { RequiredFieldValidation } from "../../../../../infra/http/validations/RequiredFieldValidation";
import { ValidationComposite } from "../../../../../infra/http/validations/ValidationComposite";
import { EmailvalidatorAdapter } from "../../../../../infra/http/validators/EmailValidatorAdapter";

export const makeSignValidation = ():ValidationComposite => {
    const emailValidator = new EmailvalidatorAdapter()
    return new ValidationComposite([
        new RequiredFieldValidation('email'),
        new RequiredFieldValidation('password'),
        new EmailValidation('email', emailValidator),
      ], 'body')
}