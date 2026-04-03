import { Session } from "@domain/entities/Session";
import { UseCase } from "../UseCase";
import { SessionAlreadyExistError } from "@application/errors/SessionAlreadyExistError";
import { ProctoredUser } from "@domain/entities/ProctoredUser";
import { SessionDetail } from "@domain/entities/SessionDetail";
import { SessionResult } from "@domain/entities/SessionResult";

export type EnrichedSession = Session & {
  proctoredUser: ProctoredUser | null;
  session_details: SessionDetail | null;
  session_result: SessionResult | null;
}

export interface GetSessionsByProctoredUserIdInterface extends UseCase<GetSessionsByProctoredUserIdInterface.Request, GetSessionsByProctoredUserIdInterface.Response>{

    execute(credentials: GetSessionsByProctoredUserIdInterface.Request): Promise<GetSessionsByProctoredUserIdInterface.Response>
    
}

export namespace GetSessionsByProctoredUserIdInterface{
    export type Request = {proctoredUserId: string, page?: number };
      export type Response = { data: EnrichedSession[], page: number, total: number, totalPages: number };
}