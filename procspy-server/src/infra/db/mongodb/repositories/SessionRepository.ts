import { CreateSessionRepository } from "@application/interfaces/repositories/sessions/CreateSessionRepository"
import dbConnection from "../helpers/db-connection"
import { Collection, Timestamp } from "mongodb"
import { mapCollection, mapDocument, objectIdToString, stringToObjectId } from "../helpers/mapper"
import { GetSessionsByProctoredUserIdRepository } from "@application/interfaces/repositories/sessions/GetSessionsByProctoredUserIdRepository"
import { GetSessionByIdRepository } from "@application/interfaces/repositories/sessions/GetSessionByIdRepository"
import { GetActiveSessionsByProctoredUserIdRepository } from "@application/interfaces/repositories/sessions/GetActiveSessionsByProctoredUserIdRepository"
import { GetSessionByTokenRepository } from "@application/interfaces/repositories/sessions/GetSessionByTokenRepository"
import { Session } from "@domain/entities/Session"
import { UpdateSessionStatusRepository } from "@application/interfaces/repositories/sessions/UpdateSessionStatusRepository"
import { UpdateSessionRepository } from "@application/interfaces/repositories/sessions/UpdateSessionRepository"
import { GetSessionsByRoomIdRepository } from "@application/interfaces/repositories/sessions/GetSessionsByRoomIdRepository"
import { EnrichedSession } from "@application/interfaces/use-cases/sessions/GetSessionsByRoomIdInterface"

function generateToken(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

async function isTokenDuplicate(collection: Collection, token: string): Promise<boolean> {
    const existingSession = await collection.findOne({ token });
    return !!existingSession;
}

export class SessionRepository implements
    CreateSessionRepository,
    GetSessionsByProctoredUserIdRepository,
    GetSessionByIdRepository,
    GetActiveSessionsByProctoredUserIdRepository,
    GetSessionByTokenRepository,
    UpdateSessionStatusRepository,
    UpdateSessionRepository,
    GetSessionsByRoomIdRepository {
    static async getCollection(): Promise<Collection> {
        return dbConnection.getCollection('sessions')
    }

    private async createUniqueToken(): Promise<string> {
        const collection = await SessionRepository.getCollection();
        let token = generateToken(8);
        while (await isTokenDuplicate(collection, token)) {
            token = generateToken(8);
        }
        return token;
    }

    async createSession(sessionData: CreateSessionRepository.Request): Promise<CreateSessionRepository.Response> {
        const collection = await SessionRepository.getCollection();
        const token = await this.createUniqueToken();
        console.log(token)
        const { insertedId } = await collection.insertOne({ ...sessionData, token, createdAt: new Date() });
        return objectIdToString(insertedId);
    }


    async getSessionsByProctoredUserId(params: GetSessionsByProctoredUserIdRepository.Request): Promise<GetSessionsByProctoredUserIdRepository.Response> {
         const collection = await SessionRepository.getCollection();
        const { proctoredUserId, page, paginationLimit } = params
        const limitNum = Number(paginationLimit)
        const offset = (page - 1) * paginationLimit;
        const pipeline = [
            {
                $match: {
                    proctoredUserId,
                },
            },
            {
                $sort: { _id: -1 }
            },
            {
                $skip: offset,
            },
            {
                $limit: limitNum,
            },

            {
                $addFields: {
                    proctoredUserIdObj: { $toObjectId: "$proctoredUserId" },
                    sessionIdStr: { $toString: "$_id" }
                }
            },
            {
                $lookup: {
                    from: "proctored_users",
                    localField: "proctoredUserIdObj",
                    foreignField: "_id",
                    as: "proctored_user"
                }
            },
            {
                $unwind: { path: "$proctored_user", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "session_details",
                    localField: "sessionIdStr",
                    foreignField: "sessionId",
                    as: "session_details"
                }
            },
            {
                $unwind: { path: "$session_details", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "session_results",
                    localField: "sessionIdStr",
                    foreignField: "sessionId",
                    as: "session_result",
                },
            },
            {
                $unwind: {
                    path: "$session_result",
                    preserveNullAndEmptyArrays: true,
                },
            },

        ];

        const enrichedSessions = await collection.aggregate(pipeline).toArray() as EnrichedSession[];
        console.log(enrichedSessions)
        const total = await collection.countDocuments({
            proctoredUserId,
        });

        const totalPages = Math.ceil(total / paginationLimit);

        return {
            data: enrichedSessions,
            page,
            total,
            totalPages,
        };
    }

    async getSessionById(id: GetSessionByIdRepository.Request): Promise<GetSessionByIdRepository.Response> {
        const collection = await SessionRepository.getCollection()
        const _id = stringToObjectId(id)
        const rawSession = await collection.findOne({ _id })
        return rawSession && mapDocument(rawSession)
    }

    async getActiveSessionsByProctoredUserId(proctoredUserId: GetActiveSessionsByProctoredUserIdRepository.Request): Promise<GetActiveSessionsByProctoredUserIdRepository.Response> {
        const collection = await SessionRepository.getCollection()
        const rawSessions = await collection.find({ proctoredUserId, status: { $in: ["ongoing", "scheduled", "paused"] } }).toArray()

        const sessions = mapCollection(rawSessions)
        return sessions
    }

    async getSessionByToken(token: GetSessionByTokenRepository.Request): Promise<GetSessionByTokenRepository.Response> {
        const collection = await SessionRepository.getCollection()
        const rawSession = await collection.findOne({ token })

        return rawSession && mapDocument(rawSession)
    }


    async updateSessionStatus(sessionData: UpdateSessionStatusRepository.Request): Promise<UpdateSessionStatusRepository.Response> {

        const collection = await SessionRepository.getCollection()

        const { token } = sessionData
        if (!token) {
            return null
        }

        const filter = { token }

        const result = await collection.updateOne(filter, { $set: sessionData })

        const rawSession = await collection.findOne(filter)
        console.log(rawSession)
        return rawSession && mapDocument(rawSession)
    }

    async updateSession(sessionData: UpdateSessionRepository.Request): Promise<UpdateSessionRepository.Response> {
        const collection = await SessionRepository.getCollection()
        const { id } = sessionData
        if (!id) {
            return null
        }
        const filter = { _id: stringToObjectId(id) }
        const result = await collection.updateOne(filter, { $set: { ...sessionData, updatedAt: new Date() } })

        const rawSession = await collection.findOne(filter)
        console.log(rawSession)
        return rawSession && mapDocument(rawSession)
    }

    async getSessionsByRoomId(params: GetSessionsByRoomIdRepository.Request): Promise<GetSessionsByRoomIdRepository.Response> {

        const collection = await SessionRepository.getCollection();
        const { roomId, page, paginationLimit } = params
        const limitNum = Number(paginationLimit)
        const offset = (page - 1) * paginationLimit;
        const pipeline = [
            {
                $match: {
                    roomId,
                    status: { $in: ["ongoing", "scheduled", "paused"] },
                },
            },
            {
                $sort: { _id: -1 }
            },
            {
                $skip: offset,
            },
            {
                $limit: limitNum,
            },

            {
                $addFields: {
                    proctoredUserIdObj: { $toObjectId: "$proctoredUserId" },
                    sessionIdStr: { $toString: "$_id" }
                }
            },
            {
                $lookup: {
                    from: "proctored_users",
                    localField: "proctoredUserIdObj",
                    foreignField: "_id",
                    as: "proctored_user"
                }
            },
            {
                $unwind: { path: "$proctored_user", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "session_details",
                    localField: "sessionIdStr",
                    foreignField: "sessionId",
                    as: "session_details"
                }
            },
            {
                $unwind: { path: "$session_details", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "session_results",
                    localField: "sessionIdStr",
                    foreignField: "sessionId",
                    as: "session_result",
                },
            },
            {
                $unwind: {
                    path: "$session_result",
                    preserveNullAndEmptyArrays: true,
                },
            },

        ];

        const enrichedSessions = await collection.aggregate(pipeline).toArray() as EnrichedSession[];
        console.log(enrichedSessions)
        const total = await collection.countDocuments({
            roomId,
            status: { $in: ["ongoing", "scheduled", "paused"] },
        });

        const totalPages = Math.ceil(total / paginationLimit);

        return {
            data: enrichedSessions,
            page,
            total,
            totalPages,
        };


    }
}