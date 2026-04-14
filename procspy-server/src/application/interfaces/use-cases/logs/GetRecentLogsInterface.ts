export interface GetRecentLogsInterface {
    execute(body: GetRecentLogsInterface.Request): Promise<GetRecentLogsInterface.Response>
}

export namespace GetRecentLogsInterface {
    export type Request = {
        limit?: number
    }
    export type Response = any
}
