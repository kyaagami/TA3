import { Collection } from "mongodb";
import dbConnection from "../helpers/db-connection";
import { mapCollection, mapDocument, objectIdToString } from "../helpers/mapper";
import { CreateFlagRepository } from "@application/interfaces/repositories/flags/CreateFlagRepository";
import { GetFlagsRepository } from "@application/interfaces/repositories/flags/GetFlagsRepository";
import { GetFlagByFlagKeyRepository } from "@application/interfaces/repositories/flags/GetFlagByFlagKeyRepository";





export class FlagRepository implements
    CreateFlagRepository,
    GetFlagsRepository,
    GetFlagByFlagKeyRepository {
    static async getCollection(): Promise<Collection> {
        return dbConnection.getCollection('flags')
    }

    async createFlag(flagData: CreateFlagRepository.Request): Promise<CreateFlagRepository.Response> {
        const collection = await FlagRepository.getCollection()
        const { insertedId } = await collection.insertOne({ ...flagData })
        return objectIdToString(insertedId)
    }

    async getFlags(params: GetFlagsRepository.Request): Promise<GetFlagsRepository.Response> {
        const collection = await FlagRepository.getCollection()
        const { page, paginationLimit } = params
        const offset = (page - 1) * paginationLimit
        const rawFlags = await collection.find({})
            .skip(offset)
            .limit(paginationLimit)
            .toArray()

        const flags = mapCollection(rawFlags)

        const total = await collection.countDocuments({})
        const totalPages = Math.ceil(total / paginationLimit)
        return {
            data: flags, page, total, totalPages,
        };
    }

    async getFlagByFlagKey(flagKey: GetFlagByFlagKeyRepository.Request): Promise<GetFlagByFlagKeyRepository.Response> {
        const collection = await FlagRepository.getCollection()
        const rawFlag = await collection.findOne({ flagKey })
        return rawFlag && mapDocument(rawFlag)
    }

}