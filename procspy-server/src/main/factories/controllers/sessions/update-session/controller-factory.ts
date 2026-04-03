import { BaseController } from "@infra/http/controllers/BaseController"
import { makeUpdateSessionValidation } from "./validation-factory"
import { UpdateSessionController } from "@infra/http/controllers/sessions/UpdateSessionController"
import { makeUpdateSession } from "@main/factories/use-cases/sessions/update-session"

export const makeUpdateSessionController = (): BaseController => {
    const validation = makeUpdateSessionValidation()
    const useCase = makeUpdateSession()

    return new UpdateSessionController(validation, useCase)
}