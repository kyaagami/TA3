import { BaseController } from "@infra/http/controllers/BaseController"
import { CreateLogByTokenController } from "@infra/http/controllers/logs/CreateLogByTokenController"
import { makeCreateLogByTokenValidation } from "./validation-factory"
import { makeCreateLogByToken } from "@main/factories/use-cases/logs/create-log-by-token-factory"
import { makeCreateOrUpdateSessionResult } from "@main/factories/use-cases/session-results/create-or-update-session-result-factory"


export const makeCreateLogByTokenController = (): BaseController => {
    const validation = makeCreateLogByTokenValidation()
    const useCase = makeCreateLogByToken()
    const useCaseSessionResult = makeCreateOrUpdateSessionResult()

    return new CreateLogByTokenController(validation, useCase, useCaseSessionResult)
}