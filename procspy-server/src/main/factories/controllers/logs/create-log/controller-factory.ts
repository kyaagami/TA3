import { BaseController } from "@infra/http/controllers/BaseController"
import { CreateLogController } from "@infra/http/controllers/logs/CreateLogController"
import { makeCreateLogValidation } from "./validation-factory"
import { makeCreateLog } from "@main/factories/use-cases/logs/create-log-factory"


export const makeCreateLogController = (): BaseController => {
    const validation = makeCreateLogValidation()
    const useCase = makeCreateLog()

    return new CreateLogController(validation, useCase)
}