import { EntityNotFoundError } from "@application/errors/EntityNotFoundError"
import { SessionAlreadyExistError } from "@application/errors/SessionAlreadyExistError"
import { GetProctoredUserByIdentifierRepository } from "@application/interfaces/repositories/proctored-users/GetProctoredUserByIdentifierRepository"
import { CreateSessionRepository } from "@application/interfaces/repositories/sessions/CreateSessionRepository"
import { GetActiveSessionsByProctoredUserIdRepository } from "@application/interfaces/repositories/sessions/GetActiveSessionsByProctoredUserIdRepository"
import { GetSessionsByProctoredUserIdRepository } from "@application/interfaces/repositories/sessions/GetSessionsByProctoredUserIdRepository"
import { CreateSessionInterface } from "@application/interfaces/use-cases/sessions/CreateSessionInterface"
import { SessionStatus } from "@domain/entities/Session"


export class CreateSession implements CreateSessionInterface {
    constructor(
        private readonly createSessionRepository: CreateSessionRepository,
        private readonly getSessionsByProctoredUserIdRepository: GetSessionsByProctoredUserIdRepository,
        private readonly getActiveSessionsByProctoredUserIdRepository: GetActiveSessionsByProctoredUserIdRepository
    ) { }

    async execute(body: CreateSessionInterface.Request): Promise<CreateSessionInterface.Response> {
        const { proctoredUserId, roomId } = body
        
        const sessions = await this.getActiveSessionsByProctoredUserIdRepository.getActiveSessionsByProctoredUserId(proctoredUserId)
        
        if(sessions && sessions?.length > 0){
            return new SessionAlreadyExistError()
        }

        const newSession = await this.createSessionRepository.createSession({
            roomId: roomId,
            proctoredUserId: proctoredUserId,
            status: SessionStatus.Scheduled,
        })

        return newSession
    }
}