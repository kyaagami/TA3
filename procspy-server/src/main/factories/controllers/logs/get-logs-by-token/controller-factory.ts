import { BaseController } from "@infra/http/controllers/BaseController"
import { GetLogsByTokenController } from "@infra/http/controllers/logs/GetLogsByTokenController"
import { makeGetLogsByTokenValidation } from "./validation-factory"
import { makeGetLogsByToken } from "@main/factories/use-cases/logs/get-logs-by-token-factory"

export const makeGetLogsByTokenController = (): BaseController => {
    const validation = makeGetLogsByTokenValidation()
    const useCase = makeGetLogsByToken()

    return new GetLogsByTokenController(validation, useCase)
}