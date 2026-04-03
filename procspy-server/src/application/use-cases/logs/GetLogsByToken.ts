import { paginationConfig } from "@application/config/pagination";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { GetLogsBySessionIdRepository } from "@application/interfaces/repositories/logs/GetLogsBySessionIdRepository";
import { GetSessionByTokenRepository } from "@application/interfaces/repositories/sessions/GetSessionByTokenRepository";
import { GetLogsByTokenInterface } from "@application/interfaces/use-cases/logs/GetLogsByTokenInterface";


export class GetLogsByToken implements GetLogsByTokenInterface {
    constructor(
        private readonly getSessionByTokenRepository: GetSessionByTokenRepository,
        private readonly getLogsBySessionIdRepository: GetLogsBySessionIdRepository
    ) { }

    async execute(body: GetLogsByTokenInterface.Request): Promise<GetLogsByTokenInterface.Response> {
        const { page = 1, token, paginationLimit = 15} = body
        
        const session = await this.getSessionByTokenRepository.getSessionByToken(token)

        if(session){
            const logs = await this.getLogsBySessionIdRepository.getLogsBySessionId({sessionId: session.id, page, paginationLimit})
            return logs
        }
        
        return { data: [], page: 0, total: 0, totalPages: 0}
    }
}