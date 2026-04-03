import { CreateProctoredUserRepository } from "@application/interfaces/repositories/proctored-users/CreateProctoredUserRepository"
import { GetProctoredUserByIdentifierRepository } from "@application/interfaces/repositories/proctored-users/GetProctoredUserByIdentifierRepository"
import { GetProctoredUsersRepository } from "@application/interfaces/repositories/proctored-users/GetProctoredUsersRepository"
import { GetProctoredUsers } from "@application/use-cases/proctored-users/GetProctoredUsers"
import { mapCollection, mapDocument, objectIdToString, stringToObjectId } from "../helpers/mapper"
import dbConnection from "../helpers/db-connection"
import { Collection } from "mongodb"
import { GetProctoredUserByIdRepository } from "@application/interfaces/repositories/proctored-users/GetProctoredUserByIdRepository"
import { UpdateProctoredUserRepository } from "@application/interfaces/repositories/proctored-users/UpdateProctoredUserRepository"



export class ProctoredUserRepository implements
    CreateProctoredUserRepository,
    GetProctoredUserByIdentifierRepository,
    GetProctoredUsersRepository,
    GetProctoredUserByIdRepository,
    UpdateProctoredUserRepository{
    static async getCollection(): Promise<Collection> {
        return dbConnection.getCollection('proctored_users')
    }

    async createProctoredUser(userData: CreateProctoredUserRepository.Request): Promise<CreateProctoredUserRepository.Response> {
        const collection = await ProctoredUserRepository.getCollection()
        const { insertedId } = await collection.insertOne({ ...userData, createdAt: new Date() })
        return objectIdToString(insertedId)
    }


    async getProctoredUserByIdentifier(identifier: GetProctoredUserByIdentifierRepository.Request): Promise<GetProctoredUserByIdentifierRepository.Response> {
        const collection = await ProctoredUserRepository.getCollection()
        const rawProctoredUser = await collection.findOne({ identifier })
        return rawProctoredUser && mapDocument(rawProctoredUser)
    }

    async getProctoredUsers(params: GetProctoredUsersRepository.Request): Promise<GetProctoredUsersRepository.Response> {
        const collection = await ProctoredUserRepository.getCollection()
        const { page, paginationLimit } = params
        const offset = (page - 1) * paginationLimit
        const rawProctoredUsers = await collection.find({deletedAt : null})
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(Number(paginationLimit))
            .toArray()

        const sessions = mapCollection(rawProctoredUsers)

        const total = await collection.countDocuments({})
        const totalPages = Math.ceil(total / paginationLimit)
        return {
            data: sessions, page, total, totalPages,
        };
    }

    async getProctoredUserById(id: GetProctoredUserByIdRepository.Request): Promise<GetProctoredUserByIdRepository.Response> {
        const collection = await ProctoredUserRepository.getCollection()
        const _id = stringToObjectId(id)
        const rawProctoredUser = await collection.findOne({ _id })
        return rawProctoredUser && mapDocument(rawProctoredUser)
    }

    async updateProctoredUser(data: UpdateProctoredUserRepository.Request): Promise<UpdateProctoredUserRepository.Response> {
        const collection = await ProctoredUserRepository.getCollection()
        const {id} = data

        const filter = { _id: stringToObjectId(id) }

        const result = await collection.updateOne(filter, { $set: data })

        const raw = await collection.findOne(filter)

        return raw && mapDocument(raw)
    }
}