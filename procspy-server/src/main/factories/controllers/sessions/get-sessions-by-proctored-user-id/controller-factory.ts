import { BaseController } from "@infra/http/controllers/BaseController"
import { GetSessionsByProctoredUserIdController } from "@infra/http/controllers/sessions/GetSessionsByProctoredUserIdController"
import { makeGetSessionsProctoredUserIdValidation } from "./validation-factory"
import { makeGetSessionsByProctoredUserId } from "@main/factories/use-cases/sessions/get-sessions-by-proctored-user-id-factory"

export const makeGetSessionsByProctoredUserIdController = (): BaseController => {
    const validation = makeGetSessionsProctoredUserIdValidation()
    const useCase = makeGetSessionsByProctoredUserId()

    return new GetSessionsByProctoredUserIdController(validation, useCase)
}