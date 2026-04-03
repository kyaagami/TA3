import validator from 'validator';
import { EmailValidator } from "../validations/interfaces/EmailValidator";

export class EmailvalidatorAdapter implements EmailValidator {
    isValid(email: string): boolean {
        return validator.isEmail(email)
    }
}