import { BaseController } from "@infra/http/controllers/BaseController"
import { CreateSessionController } from "@infra/http/controllers/sessions/CreateSessionController"
import { makeCreateSessionValidation } from "./validation-factory"
import { makeCreateSession } from "@main/factories/use-cases/sessions/create-session-factory"

export const makeCreateSessionController = (): BaseController => {
    const validation = makeCreateSessionValidation()
    const useCase = makeCreateSession()

    return new CreateSessionController(validation, useCase)
}