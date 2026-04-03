import { Collection } from "mongodb";
import dbConnection from "../helpers/db-connection";
import { mapCollection, mapDocument, objectIdToString, stringToObjectId } from "../helpers/mapper";
import { CreateGlobalSettingRepository } from "@application/interfaces/repositories/global-settings/CreateGlobalSettingRepository";
import { GetGlobalSettingByKeyRepository } from "@application/interfaces/repositories/global-settings/GetGlobalSettingByKeyRepository";
import { GetGlobalSettingsRepository } from "@application/interfaces/repositories/global-settings/GetGlobalSettingsRepository";
import { UpdateGlobalSettingRepository } from "@application/interfaces/repositories/global-settings/UpdateGlobalSettingRepository";





export class GlobalSettingRepository implements
    CreateGlobalSettingRepository,
    GetGlobalSettingByKeyRepository,
    GetGlobalSettingsRepository,
    UpdateGlobalSettingRepository {
    static async getCollection(): Promise<Collection> {
        return dbConnection.getCollection('global_settings')
    }

    async createGlobalSetting(globalSettingData: CreateGlobalSettingRepository.Request): Promise<CreateGlobalSettingRepository.Response> {
        const collection = await GlobalSettingRepository.getCollection()
        const { insertedId } = await collection.insertOne({ ...globalSettingData })
        return objectIdToString(insertedId)
    }

    async getGlobalSettingByKey(key: GetGlobalSettingByKeyRepository.Request): Promise<GetGlobalSettingByKeyRepository.Response> {
        const collection = await GlobalSettingRepository.getCollection()
        const rawGlobalSetting = await collection.findOne({ key })
        return rawGlobalSetting && mapDocument(rawGlobalSetting)
    }

    async getGlobalSettings(params: GetGlobalSettingsRepository.Request): Promise<GetGlobalSettingsRepository.Response> {
        const collection = await GlobalSettingRepository.getCollection()
        const { page, paginationLimit } = params
        console.log(paginationLimit)
        const offset = (page - 1) * paginationLimit
        const rawGlobalSettings = await collection.find({})
            .skip(offset)
            .limit(Number(paginationLimit))
            .toArray()

        const sessions = mapCollection(rawGlobalSettings)

        const total = await collection.countDocuments({})
        const totalPages = Math.ceil(total / paginationLimit)
        return {
            data: sessions, page, total, totalPages,
        };

    }

    async updateGlobalSetting(data: UpdateGlobalSettingRepository.Request): Promise<UpdateGlobalSettingRepository.Response> {
        const collection = await GlobalSettingRepository.getCollection()

        const { key } = data

        const filter = { key }
        const result = await collection.updateOne(filter, { $set: data })

        const rawGlobalSetting = await collection.findOne(filter)
        return rawGlobalSetting && mapDocument(rawGlobalSetting)
    }


}