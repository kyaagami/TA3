import { GlobalSetting } from "@domain/entities/GlobalSetting";
import { UseCase } from "../UseCase";
import { IdentifierInUseError } from "@application/errors/IdentifierInUseError";
import { GlobalSettingAlreadyExistError } from "@application/errors/GlobalSettingAlreadyExistError";


export interface CreateGlobalSettingInterface extends UseCase<CreateGlobalSettingInterface.Request, CreateGlobalSettingInterface.Response>{

    execute(credentials: CreateGlobalSettingInterface.Request): Promise<CreateGlobalSettingInterface.Response>
    
}

export namespace CreateGlobalSettingInterface{
    export type Request = Omit<GlobalSetting, 'id'>
    export type Response = string | GlobalSettingAlreadyExistError
}