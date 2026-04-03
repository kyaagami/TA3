import { SessionNotExistError } from "@application/errors/SessionNotExistError"
import { CreateLogRepository } from "@application/interfaces/repositories/logs/CreateLogRepository"
import { GetSessionByTokenRepository } from "@application/interfaces/repositories/sessions/GetSessionByTokenRepository"
import { CreateLogByTokenInterface } from "@application/interfaces/use-cases/logs/CreateLogByTokenInterface"
import { SessionStatus } from "@domain/entities/Session"


export class CreateLogByToken implements CreateLogByTokenInterface {
    constructor(
        private readonly createLogRepository: CreateLogRepository,
        private readonly getSessionByTokenRepository: GetSessionByTokenRepository,

    ) { }

    async execute(body: CreateLogByTokenInterface.Request): Promise<CreateLogByTokenInterface.Response> {
        const { flagKey, token, attachment, logType } = body

        const isSessionExist = await this.getSessionByTokenRepository.getSessionByToken(token)

        if (!isSessionExist) {
            return new SessionNotExistError()
        }

        if (isSessionExist.status !== SessionStatus.Scheduled && isSessionExist.status !== SessionStatus.Ongoing && isSessionExist.status !== SessionStatus.Paused) {
            return new SessionNotExistError()
        }

        if (isSessionExist.status === SessionStatus.Scheduled && flagKey !== "CONNECT") {
            return new SessionNotExistError()
        }
        
        const newLog = await this.createLogRepository.createLog({
            attachment: attachment ?? "",
            sessionId: isSessionExist.id,
            flagKey: flagKey ?? "DEFAULT",
            logType: logType ?? "System"
        })

        return newLog
    }
}