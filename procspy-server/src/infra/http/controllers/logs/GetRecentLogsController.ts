import { GetRecentLogsInterface } from "@application/interfaces/use-cases/logs/GetRecentLogsInterface"
import { ok } from "../../helpers/http"
import { HttpRequest } from "../../interfaces/HttpRequest"
import { HttpResponse } from "../../interfaces/HttpResponse"
import { BaseController } from "../BaseController"

export class GetRecentLogsController extends BaseController {
    constructor(
        private readonly getRecentLogs: GetRecentLogsInterface
    ) {
        super()
    }

    async execute(httpRequest: GetRecentLogsController.Request): Promise<GetRecentLogsController.Response> {
        const limit = httpRequest.query?.limit ? Number(httpRequest.query.limit) : 10
        const response = await this.getRecentLogs.execute({ limit })
        return ok(response)
    }
}

export namespace GetRecentLogsController {
    export type Request = HttpRequest<any>
    export type Response = HttpResponse<any>
}
