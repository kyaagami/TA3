import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeCreateOrUpdateSessionDetailValidation = ():ValidationComposite => {
    return new ValidationComposite([
        new RequiredFieldValidation('token'), 
        // new RequiredFieldValidation('ipAddress'), 
        new RequiredFieldValidation('userAgent'), 
        new RequiredFieldValidation('deviceId') 
      ], 'body')
}