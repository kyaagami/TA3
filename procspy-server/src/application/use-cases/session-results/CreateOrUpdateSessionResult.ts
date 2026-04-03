import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { GetFlagByFlagKeyRepository } from "@application/interfaces/repositories/flags/GetFlagByFlagKeyRepository";
import { GetGlobalSettingByKeyRepository } from "@application/interfaces/repositories/global-settings/GetGlobalSettingByKeyRepository";
import { CreateSessionResultRepository } from "@application/interfaces/repositories/session-results/CreateSessionResultRepository";
import { GetSessionResultBySessionIdRepository } from "@application/interfaces/repositories/session-results/GetSessionResultBySessionIdRepository";
import { GetSessionResultByIdRepository } from "@application/interfaces/repositories/session-results/GetSessionResultRepositoryBySessionIdRepository";
import { UpdateSessionResultRepository } from "@application/interfaces/repositories/session-results/UpdateSessionResultRepository";
import { GetSessionByIdRepository } from "@application/interfaces/repositories/sessions/GetSessionByIdRepository";
import { CreateOrUpdateSessionResultInterface } from "@application/interfaces/use-cases/session-results/CreateOrUpdateSessionResultInterface";
import { LogType } from "@domain/entities/Log";
import { FraudLevel, SessionResult } from "@domain/entities/SessionResult";


export class CreateOrUpdateSessionResult implements CreateOrUpdateSessionResultInterface {
    constructor(
        private readonly getSessionResultBySessionIdRepository: GetSessionResultBySessionIdRepository,
        private readonly createSessionResultRepository: CreateSessionResultRepository,
        private readonly updateSessionResultRepository: UpdateSessionResultRepository,
        private readonly getFlagKeyByFlagKeyRepository: GetFlagByFlagKeyRepository,
        private readonly getGlobalSettingByKeyRepository: GetGlobalSettingByKeyRepository,
    ) { }

    async execute(credentials: CreateOrUpdateSessionResultInterface.Request): Promise<CreateOrUpdateSessionResultInterface.Response> {
        try {
            const { sessionId, flagKey, logType, prevLogType } = credentials

            const existSessionResult = await this.getSessionResultBySessionIdRepository.getSessionResultBySessionId(sessionId)

            const isFlagKeyExist = await this.getFlagKeyByFlagKeyRepository.getFlagByFlagKey(flagKey)

            if (!isFlagKeyExist) {
                return new SessionNotExistError
            }

            if (!existSessionResult) {
                const newIdSessionResult = await this.createSessionResultRepository.createSessionResult({
                    sessionId,
                    falseDetection: 0,
                    trueSeverity: isFlagKeyExist.severity,
                    fraudLevel: FraudLevel.LOW,
                    totalFlags: 1,
                    totalSeverity: isFlagKeyExist.severity
                })

                const res = await this.getSessionResultBySessionIdRepository.getSessionResultBySessionId(newIdSessionResult)

                if (!res) {
                    return new SessionNotExistError
                }
                return res
            }


            const maxSeverityVar = await this.getGlobalSettingByKeyRepository.getGlobalSettingByKey("MAX_SEVERITY")
            let threshold = 120;
            if (maxSeverityVar) {
                const parsed = parseInt(maxSeverityVar.value);
                if (!isNaN(parsed)) {
                    threshold = parsed;
                }
            }



            let totalSeverity = existSessionResult.totalSeverity
            let totalFlags = existSessionResult.totalFlags
            let totalFalseDetection = existSessionResult.falseDetection
            let trueSeverity = existSessionResult.trueSeverity

            if (prevLogType) {

                if (prevLogType === LogType.True) {
                    if (logType === LogType.False) {
                        totalFalseDetection += 1
                        trueSeverity -= isFlagKeyExist.severity
                    }
                } else if (prevLogType === LogType.False) {
                    if (logType === LogType.True) {
                        totalFalseDetection -= 1
                        trueSeverity += isFlagKeyExist.severity
                    }
                } else {
                    if (logType === LogType.False) {
                        totalFalseDetection += 1
                        trueSeverity -= isFlagKeyExist.severity
                    }
                }
            } else {
                totalSeverity += isFlagKeyExist.severity
                trueSeverity += isFlagKeyExist.severity
                totalFlags += 1
            }


            const percentOfThreshold = (totalSeverity / threshold) * 100;

            const fraudLevel =
                percentOfThreshold >= 90 ? FraudLevel.CRITICAL :
                    percentOfThreshold >= 65 ? FraudLevel.HIGH:
                        percentOfThreshold >= 25 ? FraudLevel.MEDIUM :
                            FraudLevel.LOW;

            const updatedSessionResult = await this.updateSessionResultRepository.updateSessionResult({
                id: existSessionResult.id,
                falseDetection: totalFalseDetection,
                fraudLevel,
                totalFlags,
                totalSeverity,
                trueSeverity
            })

            if (!updatedSessionResult) {
                return new SessionNotExistError
            }


            return updatedSessionResult
        } catch (e) {
            console.log(e)
            return new SessionNotExistError
        }
    }
}