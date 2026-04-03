import { SignUpController } from "@infra/http/controllers/authentication/SignUpController";
import { SignInController } from "../../../../../infra/http/controllers/authentication/SignInController";
import { BaseController } from "../../../../../infra/http/controllers/BaseController";
import { makeSignIn } from "../../../use-cases/authentication/sign-in-factory";
import { makeSignUpValidation } from "./validation-factory";
import { makeSignUp } from "@main/factories/use-cases/authentication/sign-up-factory";

export const makeSignUpController = (): BaseController => {
    const validation = makeSignUpValidation()
    const useCase = makeSignUp()
    return new SignUpController(validation, useCase)
}