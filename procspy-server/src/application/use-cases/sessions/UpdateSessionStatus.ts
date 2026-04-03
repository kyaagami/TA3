import { paginationConfig } from "@application/config/pagination";
import { SessionLockedError } from "@application/errors/SesionLockedError";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { SessionStatusError } from "@application/errors/SessionStatusError";
import { GetSessionByIdRepository } from "@application/interfaces/repositories/sessions/GetSessionByIdRepository";
import { GetSessionByTokenRepository } from "@application/interfaces/repositories/sessions/GetSessionByTokenRepository";
import { UpdateSessionStatusRepository } from "@application/interfaces/repositories/sessions/UpdateSessionStatusRepository";
import { UpdateSessionStatusInterface } from "@application/interfaces/use-cases/sessions/UpdateSessionStatusInterface";
import { SessionStatus } from "@domain/entities/Session";


export class UpdateSessionStatus implements UpdateSessionStatusInterface {
    constructor(
        private readonly getSessionByTokenRepository: GetSessionByTokenRepository,
        private readonly updateSessionStatusRepository: UpdateSessionStatusRepository,
    ) { }

    async execute(credentials: UpdateSessionStatusInterface.Request): Promise<UpdateSessionStatusInterface.Response> {
        const { token, status } = credentials
        const session = await this.getSessionByTokenRepository.getSessionByToken(token)
        if (!session) {
            return new SessionNotExistError()
        }
        let updatedSession = null

        if (status == SessionStatus.Ongoing && session.status != SessionStatus.Completed && session.status != SessionStatus.Canceled && session.status != SessionStatus.Aborted) {
            updatedSession = await this.updateSessionStatusRepository.updateSessionStatus({ token, status, startTime: session?.startTime ?  session.startTime : (new Date()).toISOString()})
        } else if (status == SessionStatus.Paused && session.status != SessionStatus.Completed && session.status != SessionStatus.Canceled && session.status != SessionStatus.Aborted) {
            updatedSession = await this.updateSessionStatusRepository.updateSessionStatus({ token, status })
        } else if (status == SessionStatus.Completed && (session.status == SessionStatus.Ongoing || session.status == SessionStatus.Paused)) {
            updatedSession = await this.updateSessionStatusRepository.updateSessionStatus({ token, status, endTime: (new Date()).toISOString() })
        } else if (status == SessionStatus.Aborted && (session.status == SessionStatus.Ongoing || session.status == SessionStatus.Paused)) {
            updatedSession = await this.updateSessionStatusRepository.updateSessionStatus({ token, status, endTime: (new Date()).toISOString() })
        } else if (status == SessionStatus.Canceled && session.status == SessionStatus.Scheduled ) {
            updatedSession = await this.updateSessionStatusRepository.updateSessionStatus({ token, status })
        } else {
            return new SessionStatusError()
        }

        if (!updatedSession) {
            return new SessionNotExistError()
        }
        return updatedSession
    }
}