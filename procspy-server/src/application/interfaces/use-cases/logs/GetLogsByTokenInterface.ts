import { Log } from "@domain/entities/Log";
import { UseCase } from "../UseCase";
import { Session } from "inspector/promises";
import { ProctoredUser } from "@domain/entities/ProctoredUser";

export interface GetLogsByTokenInterface extends UseCase<GetLogsByTokenInterface.Request, GetLogsByTokenInterface.Response> {

    execute(params: GetLogsByTokenInterface.Request): Promise<GetLogsByTokenInterface.Response>

}

export namespace GetLogsByTokenInterface {
    export type Request = { token: string, page?: number, paginationLimit?: number };
    export type Response = { data: Log[] , page: number, total: number, totalPages: number };
}