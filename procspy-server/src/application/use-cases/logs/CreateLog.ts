import { SessionNotExistError } from "@application/errors/SessionNotExistError"
import { CreateLogRepository } from "@application/interfaces/repositories/logs/CreateLogRepository"
import { GetSessionByIdRepository } from "@application/interfaces/repositories/sessions/GetSessionByIdRepository"
import { CreateLogInterface } from "@application/interfaces/use-cases/logs/CreateLogIntreface"



export class CreateLog implements CreateLogInterface {
    constructor(
        private readonly createLogRepository: CreateLogRepository,
        private readonly getSessionByIdRepository: GetSessionByIdRepository,
    ) { }

    async execute(body: CreateLogInterface.Request): Promise<CreateLogInterface.Response> {
        const { sessionId, attachment, flagKey, logType } = body
        
        const isSessionExist = await this.getSessionByIdRepository.getSessionById(sessionId)
        
        if(!isSessionExist){
            return new SessionNotExistError()
        }

        const newLog = await this.createLogRepository.createLog({
            attachment: attachment ?? "",
            sessionId: sessionId,
            flagKey: flagKey ?? "DEFAULT",
            logType: logType ?? "System"
        })
        
        return newLog
    }
}