import { RequiredFieldValidation } from "@infra/http/validations/RequiredFieldValidation"
import { ValidationComposite } from "@infra/http/validations/ValidationComposite"

export const makeGetSessionsByRoomIdValidation = (): ValidationComposite => {
    return new ValidationComposite([
        new RequiredFieldValidation('roomId'),
    ], 'params')
}