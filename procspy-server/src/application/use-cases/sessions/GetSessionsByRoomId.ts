import { paginationConfig } from "@application/config/pagination";
import { GetSessionsByRoomIdRepository } from "@application/interfaces/repositories/sessions/GetSessionsByRoomIdRepository";
import { GetSessionsByRoomIdInterface } from "@application/interfaces/use-cases/sessions/GetSessionsByRoomIdInterface";


export class GetSessionsByRoomId implements GetSessionsByRoomIdInterface {
    constructor(
        private readonly getSessionsByRoomIdRepository: GetSessionsByRoomIdRepository,
    ) { }

    async execute(body: GetSessionsByRoomIdInterface.Request): Promise<GetSessionsByRoomIdInterface.Response> {
        const { page = 1, roomId, paginationLimit = 15} = body
        // const { paginationLimit } = paginationConfig;

        return this.getSessionsByRoomIdRepository.getSessionsByRoomId({roomId, page, paginationLimit})
    }
}