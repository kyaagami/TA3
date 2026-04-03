import { BaseController } from "@infra/http/controllers/BaseController"
import { GetRoomsController } from "@infra/http/controllers/rooms/GetRoomsController"
import { makeGetRoomsValidation } from "./validation-factory"
import { makeGetRooms } from "@main/factories/use-cases/rooms/get-rooms-factory"

export const makeGetRoomsController = (): BaseController => {
    const validation = makeGetRoomsValidation()
    const useCase = makeGetRooms()

    return new GetRoomsController(validation, useCase)
}