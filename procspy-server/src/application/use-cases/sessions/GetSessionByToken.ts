import { paginationConfig } from "@application/config/pagination";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { GetSessionByTokenRepository } from "@application/interfaces/repositories/sessions/GetSessionByTokenRepository";
import { GetSessionByTokenInterface } from "@application/interfaces/use-cases/sessions/GetSessionByTokenInterface";


export class GetSessionByToken implements GetSessionByTokenInterface {
    constructor(
        private readonly getSessionByTokenRepository: GetSessionByTokenRepository,
    ) { }

    async execute(credentials: GetSessionByTokenInterface.Request): Promise<GetSessionByTokenInterface.Response> {
        const token = credentials
        const session = await this.getSessionByTokenRepository.getSessionByToken(token)

        if(!session){
            return new SessionNotExistError()
        }
        
        return session

    }
}