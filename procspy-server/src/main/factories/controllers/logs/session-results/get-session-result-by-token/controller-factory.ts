import { BaseController } from "@infra/http/controllers/BaseController"
import { GetSessionResultByTokenController } from "@infra/http/controllers/session-results/GetSessionResultByTokenController"
import { makeGetSessionsProctoredUserIdValidation } from "@main/factories/controllers/sessions/get-sessions-by-proctored-user-id/validation-factory"
import { makeGetSessionResultByToken } from "@main/factories/use-cases/session-results/get-session-result-by-token-factory"
import { makeGetSessionResultByTokenValidation } from "./validation-factory"

export const makeGetSessionResultByTokenController = (): BaseController => {
    const validation = makeGetSessionResultByTokenValidation()
    const useCase = makeGetSessionResultByToken()

    return new GetSessionResultByTokenController(validation, useCase)
}