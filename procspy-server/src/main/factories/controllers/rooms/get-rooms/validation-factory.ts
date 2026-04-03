import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeGetRoomsValidation = (): ValidationComposite => {
    return new ValidationComposite([
    ], 'body')
}