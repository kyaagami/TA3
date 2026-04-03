
import { BaseController } from "@infra/http/controllers/BaseController"
import { makeCreateOrUpdateSessionResult } from "@main/factories/use-cases/session-results/create-or-update-session-result-factory"
import { makeDeleteProctoredUserByIdValidation } from "./validation-factory"
import { DeleteProctoredUserByIdController } from "@infra/http/controllers/proctored-users/DeleteProctoredUserByIdController"
import { makeDeleteProctoredUserById } from "@main/factories/use-cases/procotored-users/delete-proctored-user-by-id"


export const makeDeleteProctoredUserByIdController = (): BaseController => {
    const validation = makeDeleteProctoredUserByIdValidation()
    const useCase = makeDeleteProctoredUserById()

    return new DeleteProctoredUserByIdController(validation, useCase)
}