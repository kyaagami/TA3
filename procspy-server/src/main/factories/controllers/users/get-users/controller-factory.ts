import { GetUsersController } from "@infra/http/controllers/users/GetUsersController";
import { BaseController } from "../../../../../infra/http/controllers/BaseController";
import { makeGetUsersValidation } from "./validation-factory";
import { makeGetUsers } from "@main/factories/use-cases/users/get-users-factory";

export const makeGetUsersController = (): BaseController => {
    const validation = makeGetUsersValidation()
    const useCase = makeGetUsers()

    return new GetUsersController(validation, useCase)
}