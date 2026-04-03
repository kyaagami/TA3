import { SignInController } from "../../../../../infra/http/controllers/authentication/SignInController";
import { BaseController } from "../../../../../infra/http/controllers/BaseController";
import { makeSignIn } from "../../../use-cases/authentication/sign-in-factory";
import { makeSignValidation } from "./validation-factory";

export const makeSignInController = (): BaseController => {
    const validation = makeSignValidation()
    const useCase = makeSignIn()

    return new SignInController(validation, useCase)
}