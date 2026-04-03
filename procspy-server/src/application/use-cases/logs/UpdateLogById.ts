import { LogNotExistError } from "@application/errors/LogNotExistError"
import { LogNotUpdatedError } from "@application/errors/LogNotUpdatedError"
import { SessionNotExistError } from "@application/errors/SessionNotExistError"
import { GetLogByIdRepository } from "@application/interfaces/repositories/logs/GetLogByIdRepository"
import { UpdateLogRepository } from "@application/interfaces/repositories/logs/UpdateLogRepository"
import { GetSessionByIdRepository } from "@application/interfaces/repositories/sessions/GetSessionByIdRepository"
import { UpdateLogByIdInterface } from "@application/interfaces/use-cases/logs/UpdateLogByIdInterface"



export class UpdateLogById implements UpdateLogByIdInterface {
    constructor(
        private readonly getLogByIdRepository: GetLogByIdRepository,
        private readonly updateLogRepository: UpdateLogRepository,
    ) { }

    async execute(body: UpdateLogByIdInterface.Request): Promise<UpdateLogByIdInterface.Response> {
        const { id, logType } = body

        const isExist = await this.getLogByIdRepository.getLogById(id)

        if (!isExist) {
            return new LogNotExistError()
        }

        if (logType === isExist.logType) {
            return new LogNotUpdatedError()
        }

        if (!["True", "False"].includes(logType)) {
            return new LogNotExistError()
        }


        const updatedLog = await this.updateLogRepository.updateLog({ id, logType })

        if (!updatedLog) {
            return new LogNotExistError()
        }

        return {prevLogType: isExist.logType, ...updatedLog}
    }
}