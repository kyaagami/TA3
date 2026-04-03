import { Validation } from "../../../../../infra/http/interfaces/Validation";
import { EmailValidation } from "../../../../../infra/http/validations/EmailValidation";
import { RequiredFieldValidation } from "../../../../../infra/http/validations/RequiredFieldValidation";
import { ValidationComposite } from "../../../../../infra/http/validations/ValidationComposite";
import { EmailvalidatorAdapter } from "../../../../../infra/http/validators/EmailValidatorAdapter";

export const makeUpdateUserValidation = ():ValidationComposite => {
   const emailValidator = new EmailvalidatorAdapter()
    return new ValidationComposite([
        new RequiredFieldValidation('id'),
        new EmailValidation("email", emailValidator),
        new RequiredFieldValidation('name'),
        new RequiredFieldValidation('username'),
        new RequiredFieldValidation('email'),
        // new RequiredFieldValidation('password'),
        
      ], 'body')
}