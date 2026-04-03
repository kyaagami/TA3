import { UpdateUserController } from "@infra/http/controllers/users/UpdateUserController";
import { BaseController } from "../../../../../infra/http/controllers/BaseController";
import { makeUpdateUserValidation } from "./validation-factory";
import { makeUpdateUser } from "@main/factories/use-cases/users/update-user-factory";

export const makeUpdateUserController = (): BaseController => {
    const validation = makeUpdateUserValidation()
    const useCase = makeUpdateUser()

    return new UpdateUserController(validation, useCase)
}