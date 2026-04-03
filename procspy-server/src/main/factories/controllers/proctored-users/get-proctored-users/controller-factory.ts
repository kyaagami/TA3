import { BaseController } from "@infra/http/controllers/BaseController"
import { GetProctoredUsersController } from "@infra/http/controllers/proctored-users/GetProctoredUsersController"
// import { makeGetProctoredUsersValidation } from "./validation-factory"
import { makeGetProctoredUsers } from "@main/factories/use-cases/procotored-users/get-proctored-users-factory"

export const makeGetProctoredUsersController = (): BaseController => {
    // const validation = makeGetProctoredUsersValidation()
    const useCase = makeGetProctoredUsers()

    return new GetProctoredUsersController( useCase)
}