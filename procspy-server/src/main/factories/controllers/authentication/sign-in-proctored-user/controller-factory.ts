import { SignInProctoredUser } from "@application/use-cases/authentication/SignInProctoredUser"
import { BaseController } from "@infra/http/controllers/BaseController"
// import { makeGetProctoredUsersValidation } from "./validation-factory"
import { makeGetProctoredUsers } from "@main/factories/use-cases/procotored-users/get-proctored-users-factory"
import { makeSignInProctoredUserValidation } from "./validation-factory"
import { SignInProctoredUserController } from "@infra/http/controllers/authentication/SignInProctoredUserController"
import { makeSignInProctoredUser } from "@main/factories/use-cases/authentication/sign-in-proctored-user-factory"

export const makeSignInProctoredUserController = (): BaseController => {
    const validation = makeSignInProctoredUserValidation()
    const useCase = makeSignInProctoredUser()
    return new SignInProctoredUserController(validation, useCase)
}