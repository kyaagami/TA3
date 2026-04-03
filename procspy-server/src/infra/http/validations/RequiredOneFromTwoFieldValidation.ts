import { Validation } from "../interfaces/Validation"
import { MissingParamError } from "../errors/MissingParamError"

export class RequiredOneFromTwoFieldValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldNameSecond: string
  ) {}

  validate(input: any): Error | null {
    if (!input[this.fieldName] && !input[this.fieldNameSecond]) {
      return new MissingParamError(this.fieldName)
    }
    return null
  }
}