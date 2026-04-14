export interface GetRecentLogsRepository {
    getRecentLogs(params: GetRecentLogsRepository.Request): Promise<GetRecentLogsRepository.Response>
}

export namespace GetRecentLogsRepository {
    export type Request = {
        limit: number
    }
    export type Response = any
}
