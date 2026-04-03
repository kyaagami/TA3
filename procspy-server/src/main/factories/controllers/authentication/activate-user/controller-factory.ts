import { ActivateUserController } from "@infra/http/controllers/authentication/ActivateUserController";
import { BaseController } from "../../../../../infra/http/controllers/BaseController";
import { makeActivateUserValidation } from "./validation-factory";
import { makeActivateUser } from "@main/factories/use-cases/authentication/activate-user-factory";

export const makeActivateUserController = (): BaseController => {
    const validation = makeActivateUserValidation()
    const useCase = makeActivateUser()

    return new ActivateUserController(validation, useCase)
}