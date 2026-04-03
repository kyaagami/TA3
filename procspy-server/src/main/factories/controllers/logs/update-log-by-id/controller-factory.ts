import { BaseController } from "@infra/http/controllers/BaseController"
import { UpdateLogByIdController } from "@infra/http/controllers/logs/UpdateLogByIdController"
import { makeUpdateLogByIdValidation } from "./validation-factory"
import { makeUpdateLogById } from "@main/factories/use-cases/logs/update-log-by-id-factory"
import { makeCreateOrUpdateSessionResult } from "@main/factories/use-cases/session-results/create-or-update-session-result-factory"


export const makeUpdateLogByIdController = (): BaseController => {
    const validation = makeUpdateLogByIdValidation()
    const useCase = makeUpdateLogById()
    const useCaseSessionResult = makeCreateOrUpdateSessionResult()

    return new UpdateLogByIdController(validation, useCase, useCaseSessionResult)
}