import { UseCase } from "../UseCase";
import { Log, LogType } from "@domain/entities/Log";
import { LogNotExistError } from "@application/errors/LogNotExistError";
import { GlobalSetting } from "@domain/entities/GlobalSetting";
import { GlobalSettingAlreadyExistError } from "@application/errors/GlobalSettingAlreadyExistError";
import { GlobalSettingNotExistError } from "@application/errors/GlobalSettingError";


export interface UpdateGlobalSettingInterface extends UseCase<UpdateGlobalSettingInterface.Request, UpdateGlobalSettingInterface.Response>{

    execute(credentials: UpdateGlobalSettingInterface.Request): Promise<UpdateGlobalSettingInterface.Response>
    
}

export namespace UpdateGlobalSettingInterface{
    export type Request =  GlobalSetting
    export type Response = GlobalSetting | GlobalSettingNotExistError
}