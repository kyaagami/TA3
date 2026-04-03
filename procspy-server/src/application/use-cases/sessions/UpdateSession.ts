import { paginationConfig } from "@application/config/pagination";
import { SessionLockedError } from "@application/errors/SesionLockedError";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { GetSessionByIdRepository } from "@application/interfaces/repositories/sessions/GetSessionByIdRepository";
import { GetSessionByTokenRepository } from "@application/interfaces/repositories/sessions/GetSessionByTokenRepository";
import { UpdateSessionRepository } from "@application/interfaces/repositories/sessions/UpdateSessionRepository";
import { UpdateSessionInterface } from "@application/interfaces/use-cases/sessions/UpdateSessionInterface";
import { SessionStatus } from "@domain/entities/Session";


export class UpdateSession implements UpdateSessionInterface {
    constructor(
        private readonly getSessionByIdRepository: GetSessionByIdRepository,
        private readonly UpdateSessionRepository: UpdateSessionRepository,
    ) { }

    async execute(credentials: UpdateSessionInterface.Request): Promise<UpdateSessionInterface.Response> {
        const { id, proctoredUserId, roomId, endTime, startTime, status, token } = credentials
        if(!id){
            return new SessionNotExistError()
        }

        const session = await this.getSessionByIdRepository.getSessionById(id)
        if (!session) {
            return new SessionNotExistError()
        }

        const updatedSession = await this.UpdateSessionRepository.updateSession({ id, proctoredUserId, roomId, status, token })

        if (!updatedSession) {
            return new SessionNotExistError()
        }
        return updatedSession

    }
}