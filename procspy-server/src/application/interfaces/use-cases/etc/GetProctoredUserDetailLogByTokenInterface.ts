import { Log } from "@domain/entities/Log";
import { UseCase } from "../UseCase";
import { ProctoredUser } from "@domain/entities/ProctoredUser";
import { SessionNotExistError } from "@application/errors/SessionNotExistError";
import { Session } from "@domain/entities/Session";
import { SessionDetail } from "@domain/entities/SessionDetail";

export interface GetProctoredUserDetailLogByTokenInterface extends UseCase<GetProctoredUserDetailLogByTokenInterface.Request, GetProctoredUserDetailLogByTokenInterface.Response> {

    execute(token: GetProctoredUserDetailLogByTokenInterface.Request): Promise<GetProctoredUserDetailLogByTokenInterface.Response>

}

export namespace GetProctoredUserDetailLogByTokenInterface {
    export type Request = string;
    export type Response = { data: {
        session: Session,
        user: ProctoredUser
        session_detail: SessionDetail
    }} | SessionNotExistError;
}