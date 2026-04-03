import { paginationConfig } from "@application/config/pagination";
import { GetLogsByRoomIdRepository } from "@application/interfaces/repositories/logs/GetLogsByRoomIdRepository";
import { GetLogsByRoomIdInterface } from "@application/interfaces/use-cases/logs/GetLogsByRoomIdInterface";


export class GetLogsByRoomId implements GetLogsByRoomIdInterface {
    constructor(
        private readonly getLogsByRoomIdRepository: GetLogsByRoomIdRepository,
    ) { }

    async execute(body: GetLogsByRoomIdInterface.Request): Promise<GetLogsByRoomIdInterface.Response> {
        const { page = 1, roomId, paginationLimit = 15} = body
        
        return this.getLogsByRoomIdRepository.getLogsByRoomId({roomId, page, paginationLimit})
    }
}