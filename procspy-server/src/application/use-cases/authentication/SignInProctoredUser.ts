import { SessionLockedError } from "@application/errors/SesionLockedError"
import { SessionEndedError } from "@application/errors/SessionEndedError"
import { SessionNotExistError } from "@application/errors/SessionNotExistError"
import { GetGlobalSettingByKeyRepository } from "@application/interfaces/repositories/global-settings/GetGlobalSettingByKeyRepository"
import { GetProctoredUserByIdRepository } from "@application/interfaces/repositories/proctored-users/GetProctoredUserByIdRepository"
import { GetSessionByTokenRepository } from "@application/interfaces/repositories/sessions/GetSessionByTokenRepository"
import { SignInProctoredUserInterface } from "@application/interfaces/use-cases/authentication/SignInProctoredUserInterface"
import { GlobalSetting } from "@domain/entities/GlobalSetting"
import { SessionStatus } from "@domain/entities/Session"


export class SignInProctoredUser implements SignInProctoredUserInterface {
    constructor(
        private readonly getSessionByTokenRepository: GetSessionByTokenRepository,
        private readonly getProctoredUserByIdRepository: GetProctoredUserByIdRepository,
        private readonly getGlobalSettingByKeyRepository: GetGlobalSettingByKeyRepository
    ) { }

    async execute(credentials: SignInProctoredUserInterface.Request): Promise<SignInProctoredUserInterface.Response> {
        const { token } = credentials

        console.log(token)
        const session = await this.getSessionByTokenRepository.getSessionByToken(token)
        if (!session) {
            return new SessionNotExistError()
        }

        if(session.status && [SessionStatus.Aborted, SessionStatus.Completed, SessionStatus.Canceled].includes(session.status)){
            return new SessionEndedError(session.status)
        }

        const user = await this.getProctoredUserByIdRepository.getProctoredUserById(session.proctoredUserId)

        if (!user) {
            return new SessionNotExistError()
        }
        const { id: _, ...newUser } = user;
        const { id: __, ...newSession } = session;

        const PLATFORM_TYPE = await this.getGlobalSettingByKeyRepository.getGlobalSettingByKey("PLATFORM_TYPE");
        const PLATFORM_DOMAIN = await this.getGlobalSettingByKeyRepository.getGlobalSettingByKey("PLATFORM_DOMAIN");
        const PLATFORM_NAME = await this.getGlobalSettingByKeyRepository.getGlobalSettingByKey("PLATFORM_NAME");

        const settings: { [key: string]: GlobalSetting } = {};

        if (PLATFORM_TYPE) {
            settings["PLATFORM_TYPE"] = PLATFORM_TYPE;
        }
        if (PLATFORM_DOMAIN) {
            settings["PLATFORM_DOMAIN"] = PLATFORM_DOMAIN;
        }
        if (PLATFORM_NAME) {
            settings["PLATFORM_NAME"] = PLATFORM_NAME;
        }
        
        return {
            session: newSession,
            user: newUser,
            settings
        }

    }
}