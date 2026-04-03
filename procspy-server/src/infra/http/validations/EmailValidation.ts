import { Validation } from '../interfaces/Validation'
import { EmailValidator } from './interfaces/EmailValidator'
import { InvalidParamError } from '../errors/InvalidParamError'

export class EmailValidation implements Validation {
    constructor(
        private readonly fieldName: string,
        private readonly emailValidator: EmailValidator,
    ) { }

    validate(input: any): Error | null {
        const isValid = this.emailValidator.isValid(input[this.fieldName])
        if (!isValid) {
            return new InvalidParamError(this.fieldName)
        }
        return null
    }
}