import { CreateSessionResultRepository } from "@application/interfaces/repositories/session-results/CreateSessionResultRepository"
import dbConnection from "../helpers/db-connection"
import { Collection, Timestamp } from "mongodb"
import { UpdateSessionResultRepository } from "@application/interfaces/repositories/session-results/UpdateSessionResultRepository"
import { GetSessionResultByIdRepository } from "@application/interfaces/repositories/session-results/GetSessionResultRepositoryBySessionIdRepository"
import { mapDocument, objectIdToString, stringToObjectId } from "../helpers/mapper"
import { GetSessionResultBySessionIdRepository } from "@application/interfaces/repositories/session-results/GetSessionResultBySessionIdRepository"


export class SessionResultRepository implements
    CreateSessionResultRepository,
    UpdateSessionResultRepository,
    GetSessionResultByIdRepository,
    GetSessionResultBySessionIdRepository {


    static async getCollection(): Promise<Collection> {
        return dbConnection.getCollection('session_results')
    }

    async getSessionResultById(id: GetSessionResultByIdRepository.Request): Promise<GetSessionResultByIdRepository.Response> {
        const collection = await SessionResultRepository.getCollection()
        const _id = stringToObjectId(id)
        const rawSessionResult = await collection.findOne({ _id })
        return rawSessionResult && mapDocument(rawSessionResult)
    }

    async getSessionResultBySessionId(sessionId: GetSessionResultBySessionIdRepository.Request): Promise<GetSessionResultBySessionIdRepository.Response> {
        const collection = await SessionResultRepository.getCollection()
        const rawSessionResult = await collection.findOne({ sessionId })
        return rawSessionResult && mapDocument(rawSessionResult)
    }

    async updateSessionResult(data: UpdateSessionResultRepository.Request): Promise<UpdateSessionResultRepository.Response> {
        const collection = await SessionResultRepository.getCollection()

        const { id } = data

        const filter = { _id: stringToObjectId(id) }

        const result = await collection.updateOne(filter, { $set: {...data, updatedAt: new Date()} })

        const rawSessionResult = await collection.findOne(filter)
        return rawSessionResult && mapDocument(rawSessionResult)
    }

    async createSessionResult(sessionResultData: CreateSessionResultRepository.Request): Promise<CreateSessionResultRepository.Response> {
        const collection = await SessionResultRepository.getCollection();
        const { insertedId } = await collection.insertOne({ ...sessionResultData, createdAt: new Date() });
        return objectIdToString(insertedId);
    }

}