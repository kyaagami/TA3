import { Log } from "@domain/entities/Log";
import { UseCase } from "../UseCase";
import { ProctoredUser } from "@domain/entities/ProctoredUser";
import { Flag } from "@domain/entities/Flag";
import { Session } from "@domain/entities/Session";

export type EnrichedLog  = Log & {session: Session, flag: Flag}

export interface GetLogsByRoomIdInterface extends UseCase<GetLogsByRoomIdInterface.Request, GetLogsByRoomIdInterface.Response> {

    execute(params: GetLogsByRoomIdInterface.Request): Promise<GetLogsByRoomIdInterface.Response>

}

export namespace GetLogsByRoomIdInterface {
    export type Request = {roomId: string, page: number, paginationLimit: number }
    export type Response = { data: EnrichedLog[], page: number, total: number, totalPages: number };
}