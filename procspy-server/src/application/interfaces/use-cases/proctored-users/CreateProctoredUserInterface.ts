import { ProctoredUser } from "@domain/entities/ProctoredUser";
import { UseCase } from "../UseCase";
import { IdentifierInUseError } from "@application/errors/IdentifierInUseError";


export interface CreateProctoredUserInterface extends UseCase<CreateProctoredUserInterface.Request, CreateProctoredUserInterface.Response>{

    execute(credentials: CreateProctoredUserInterface.Request): Promise<CreateProctoredUserInterface.Response>
    
}

export namespace CreateProctoredUserInterface{
    export type Request = Omit<ProctoredUser, 'id' | 'createdAt'>
    export type Response = string | IdentifierInUseError
}