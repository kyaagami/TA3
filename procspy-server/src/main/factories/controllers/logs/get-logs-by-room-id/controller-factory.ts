import { BaseController } from "@infra/http/controllers/BaseController"
import { GetLogsByRoomIdController } from "@infra/http/controllers/logs/GetLogsByRoomIdController"
import { makeGetLogsByRoomIdValidation } from "./validation-factory"
import { makeGetLogsByRoomId } from "@main/factories/use-cases/logs/get-logs-by-room-id-factory"

export const makeGetLogsByRoomIdController = (): BaseController => {
    const validation = makeGetLogsByRoomIdValidation()
    const useCase = makeGetLogsByRoomId()

    return new GetLogsByRoomIdController(validation, useCase)
}