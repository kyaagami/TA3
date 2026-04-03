import { BaseController } from "@infra/http/controllers/BaseController"
import { UpdateSessionStatusController } from "@infra/http/controllers/sessions/UpdateSessionStatusController"
import { makeUpdateSessionStatusValidation } from "./validation-factory"
import { makeUpdateSessionStatus } from "@main/factories/use-cases/sessions/update-session-status-factory"

export const makeUpdateSessionStatusController = (): BaseController => {
    const validation = makeUpdateSessionStatusValidation()
    const useCase = makeUpdateSessionStatus()

    return new UpdateSessionStatusController(validation, useCase)
}