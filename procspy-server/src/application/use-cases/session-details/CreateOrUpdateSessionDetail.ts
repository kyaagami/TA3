import { paginationConfig } from "@application/config/pagination";
import { SessionLockedError } from "@application/errors/SesionLockedError";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { CreateOrUpdateSessionDetailRepository } from "@application/interfaces/repositories/session-details/CreateOrUpdateSessionDetailRepository";
import { GetSessionDetailBySessionIdRepository } from "@application/interfaces/repositories/session-details/GetSessionDetailBySessionIdRepository";
import { GetSessionByIdRepository } from "@application/interfaces/repositories/sessions/GetSessionByIdRepository";
import { GetSessionByTokenRepository } from "@application/interfaces/repositories/sessions/GetSessionByTokenRepository";
import { CreateOrUpdateSessionDetailInterface } from "@application/interfaces/use-cases/session-details/CreateOrUpdateSessionDetailInterface";
import { SessionStatus } from "@domain/entities/Session";


export class CreateOrUpdateSessionDetail implements CreateOrUpdateSessionDetailInterface {
    constructor(
        private readonly createOrUpdateSessionDetailRepository: CreateOrUpdateSessionDetailRepository,
        private readonly getSessionDetailBySessionIdRepository: GetSessionDetailBySessionIdRepository,
        private readonly getSessionByTokenRepository: GetSessionByTokenRepository
    ) { }

    async execute(credentials: CreateOrUpdateSessionDetailInterface.Request): Promise<CreateOrUpdateSessionDetailInterface.Response> {
        const { token, ...newCredentials } = credentials
        const session = await this.getSessionByTokenRepository.getSessionByToken(token)

        console.log("PENTING ", credentials)

        if (!session) {
            return new SessionNotExistError()
        }

        const sessionId = session.id
        console.log(session)

        if (session.status === SessionStatus.Completed) {
            return new SessionLockedError()
        }
        const sessionDetail = await this.getSessionDetailBySessionIdRepository.getSessionDetailBySessionId(sessionId)
        console.log(sessionDetail)
        if (sessionDetail && (sessionDetail?.deviceId != newCredentials.deviceId || sessionDetail.userAgent != newCredentials.userAgent)) {
            return new SessionLockedError()
        }

        const updatedSessionDetail = await this.createOrUpdateSessionDetailRepository.createOrUpdateSessionDetail({ ...newCredentials, sessionId })

        return {
            prevIp: sessionDetail?.ipAddress || "",
            ...updatedSessionDetail
        }
    }
}