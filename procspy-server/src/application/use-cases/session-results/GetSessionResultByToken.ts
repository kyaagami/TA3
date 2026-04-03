import { paginationConfig } from "@application/config/pagination";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { GetSessionResultBySessionIdRepository } from "@application/interfaces/repositories/session-results/GetSessionResultBySessionIdRepository";
import { GetSessionByTokenRepository } from "@application/interfaces/repositories/sessions/GetSessionByTokenRepository";
import { GetSessionResultByTokenInterface } from "@application/interfaces/use-cases/session-results/GetSessionResultByTokenInterface";


export class GetSessionResultByToken implements GetSessionResultByTokenInterface {
    constructor(
        private readonly getSessionByTokenRepository: GetSessionByTokenRepository,
        private readonly getSessionResultBySessionIdRepository: GetSessionResultBySessionIdRepository
    ) { }

    async execute(credentials: GetSessionResultByTokenInterface.Request): Promise<GetSessionResultByTokenInterface.Response> {
        const token = credentials
        const session = await this.getSessionByTokenRepository.getSessionByToken(token)

        if(!session){
            return new SessionNotExistError()
        }

        const sessionResult = await this.getSessionResultBySessionIdRepository.getSessionResultBySessionId(session.id)
        
        if(!sessionResult){
            return new SessionNotExistError()
        }

        return sessionResult

    }
}