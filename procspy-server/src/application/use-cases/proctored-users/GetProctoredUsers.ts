import { paginationConfig } from "@application/config/pagination";
import { GetProctoredUsersRepository } from "@application/interfaces/repositories/proctored-users/GetProctoredUsersRepository";
import { GetProctoredUsersInterface } from "@application/interfaces/use-cases/proctored-users/GetProctoredUsersInterface";
import { GetRoomsInterface } from "@application/interfaces/use-cases/rooms/GetRoomsInterface"


export class GetProctoredUsers implements GetProctoredUsersInterface {
    constructor(
        private readonly getProctoredUsersRepository: GetProctoredUsersRepository,
    ) { }

    async execute(body: GetProctoredUsersInterface.Request): Promise<GetProctoredUsersInterface.Response> {
        const { page = 1, paginationLimit = 15 } = body


        return this.getProctoredUsersRepository.getProctoredUsers({page, paginationLimit})
    }
}