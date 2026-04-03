import { ProctoredUser } from "@domain/entities/ProctoredUser";
import { UseCase } from "../UseCase";
import { ProctoredUserNotExistError } from "@application/errors/ProctoredUserNotExistError";


export interface UpdateProctoredUserInterface extends UseCase<UpdateProctoredUserInterface.Request, UpdateProctoredUserInterface.Response> {

    execute(credentials: UpdateProctoredUserInterface.Request): Promise<UpdateProctoredUserInterface.Response>

}

export namespace UpdateProctoredUserInterface {
    export type Request = Omit<ProctoredUser, 'createdAt'>
    export type Response = ProctoredUser | ProctoredUserNotExistError
}