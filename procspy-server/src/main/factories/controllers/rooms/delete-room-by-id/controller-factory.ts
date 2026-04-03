
import { BaseController } from "@infra/http/controllers/BaseController"
import { DeleteRoomByIdController } from "@infra/http/controllers/rooms/DeleteRoomByIdController"
import { makeCreateOrUpdateSessionResult } from "@main/factories/use-cases/session-results/create-or-update-session-result-factory"
import { makeDeleteRoomByIdValidation } from "./validation-factory"
import { makeDeleteRoomById } from "@main/factories/use-cases/rooms/delete-room-by-id"


export const makeDeleteRoomByIdController = (): BaseController => {
    const validation = makeDeleteRoomByIdValidation()
    const useCase = makeDeleteRoomById()

    return new DeleteRoomByIdController(validation, useCase)
}