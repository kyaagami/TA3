import { paginationConfig } from "@application/config/pagination";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { GetSessionByIdRepository } from "@application/interfaces/repositories/sessions/GetSessionByIdRepository";
import { GetSessionByIdInterface } from "@application/interfaces/use-cases/sessions/GetSessionByIdInterface";


export class GetSessionById implements GetSessionByIdInterface {
    constructor(
        private readonly GetSessionByIdRepository: GetSessionByIdRepository,
    ) { }

    async execute(credentials: GetSessionByIdInterface.Request): Promise<GetSessionByIdInterface.Response> {
        const id = credentials
        const session = await this.GetSessionByIdRepository.getSessionById(id)

        if(!session){
            return new SessionNotExistError()
        }
        
        return session

    }
}