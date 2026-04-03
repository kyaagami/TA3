import { CreateSessionRepository } from "@application/interfaces/repositories/sessions/CreateSessionRepository"
import dbConnection from "../helpers/db-connection"
import { Collection, Timestamp } from "mongodb"
import { mapCollection, mapDocument, objectIdToString, stringToObjectId } from "../helpers/mapper"
import { GetSessionsByProctoredUserIdRepository } from "@application/interfaces/repositories/sessions/GetSessionsByProctoredUserIdRepository"
import { GetSessionByIdRepository } from "@application/interfaces/repositories/sessions/GetSessionByIdRepository"
import { GetActiveSessionsByProctoredUserIdRepository } from "@application/interfaces/repositories/sessions/GetActiveSessionsByProctoredUserIdRepository"
import { GetSessionByTokenRepository } from "@application/interfaces/repositories/sessions/GetSessionByTokenRepository"
import { Session } from "@domain/entities/Session"
import { CreateOrUpdateSessionDetailRepository } from "@application/interfaces/repositories/session-details/CreateOrUpdateSessionDetailRepository"
import { GetSessionDetailBySessionIdRepository } from "@application/interfaces/repositories/session-details/GetSessionDetailBySessionIdRepository"


export class SessionDetailRepository implements
    CreateOrUpdateSessionDetailRepository,
    GetSessionDetailBySessionIdRepository {
    static async getCollection(): Promise<Collection> {
        return dbConnection.getCollection('session_details')
    }

    async createOrUpdateSessionDetail(sessionDetailData: CreateOrUpdateSessionDetailRepository.Request): Promise<CreateOrUpdateSessionDetailRepository.Response> {
        const collection = await SessionDetailRepository.getCollection();

        const filter = { 
            sessionId: sessionDetailData.sessionId, 
        }; 
        const update = {
            $set: {
                ...sessionDetailData,
                updatedAt: new Date()
            },
            $setOnInsert: {
                createdAt: new Date()
            }
        };
        const result =  await collection.updateOne(filter, update, { upsert: true });
        
        const rawSessionDetail = await collection.findOne(filter);
        console.log(rawSessionDetail)

        return rawSessionDetail && mapDocument(rawSessionDetail)
    }

    async getSessionDetailBySessionId(sessionId: GetSessionDetailBySessionIdRepository.Request): Promise<GetSessionDetailBySessionIdRepository.Response> {
        const collection = await SessionDetailRepository.getCollection();

        const rawSessionDetail = await collection.findOne({ sessionId })
        console.log(rawSessionDetail)
        return rawSessionDetail && mapDocument(rawSessionDetail)
    }
}