import { paginationConfig } from "@application/config/pagination";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { GetProctoredUserByIdRepository } from "@application/interfaces/repositories/proctored-users/GetProctoredUserByIdRepository";
import { GetSessionDetailBySessionIdRepository } from "@application/interfaces/repositories/session-details/GetSessionDetailBySessionIdRepository";
import { GetSessionByTokenRepository } from "@application/interfaces/repositories/sessions/GetSessionByTokenRepository";
import { GetProctoredUserDetailLogByTokenInterface } from "@application/interfaces/use-cases/etc/GetProctoredUserDetailLogByTokenInterface";

export class GetProctoredUserDetailLogByToken implements GetProctoredUserDetailLogByTokenInterface {
    constructor(
        private readonly getSessionByTokenRepository: GetSessionByTokenRepository,
        private readonly getProctoredUserByIdRepository: GetProctoredUserByIdRepository,
        private readonly getSessionDetailBySessionIdRepository: GetSessionDetailBySessionIdRepository
    ) { }

    async execute(token: GetProctoredUserDetailLogByTokenInterface.Request): Promise<GetProctoredUserDetailLogByTokenInterface.Response> {
        

        const session = await this.getSessionByTokenRepository.getSessionByToken(token)
        if(!session){
            return new SessionNotExistError()
        }
        
        const proctoredUser = await this.getProctoredUserByIdRepository.getProctoredUserById(session.proctoredUserId)

        if(!proctoredUser){
            return new SessionNotExistError()
        }

        const sessionDetail = await this.getSessionDetailBySessionIdRepository.getSessionDetailBySessionId(session.id)

        if(!sessionDetail) {
            return new SessionNotExistError()
        }
        
        return {
            data : {
                session,
                user: proctoredUser,
                session_detail: sessionDetail
            }
        }
    }   
}