
import { BaseController } from "@infra/http/controllers/BaseController"
import { makeCreateOrUpdateSessionResult } from "@main/factories/use-cases/session-results/create-or-update-session-result-factory"
import { makeUpdateProctoredUserValidation } from "./validation-factory"
import { UpdateProctoredUserController } from "@infra/http/controllers/proctored-users/UpdateProctoredUserController"
import { makeUpdateProctoredUser } from "@main/factories/use-cases/procotored-users/update-proctored-user-factory"


export const makeUpdateProctoredUserController = (): BaseController => {
    const validation = makeUpdateProctoredUserValidation()
    const useCase = makeUpdateProctoredUser()

    return new UpdateProctoredUserController(validation, useCase)
}