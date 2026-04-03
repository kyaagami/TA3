import { Collection } from "mongodb";
import { CreateUserRepository } from "../../../../application/interfaces/repositories/authentication/CreateUserRepository";
import { GetUserByEmailRepository } from "../../../../application/interfaces/repositories/authentication/GetUserByEmailRepository";
import dbConnection from "../helpers/db-connection";
import { mapCollection, mapDocument, objectIdToString, stringToObjectId } from "../helpers/mapper";
import { GetUserByIdRepository } from "@application/interfaces/repositories/users/GetUserByIdRepository";
import { UpdateUserRepository } from "@application/interfaces/repositories/users/UpdateUserRepository";
import { GetUsersRepository } from "@application/interfaces/repositories/users/GetUsersRepository";




export class UserRepository implements
    CreateUserRepository,
    GetUserByEmailRepository,
    GetUserByIdRepository,
    UpdateUserRepository,
    GetUsersRepository {
    static async getCollection(): Promise<Collection> {
        return dbConnection.getCollection('users')
    }

    async createUser(userData: CreateUserRepository.Request): Promise<CreateUserRepository.Response> {
        const collection = await UserRepository.getCollection()
        const { insertedId } = await collection.insertOne({ ...userData, createdAt: new Date() })
        return objectIdToString(insertedId)
    }

    async getUserByEmail(email: GetUserByEmailRepository.Request): Promise<GetUserByEmailRepository.Response> {
        const collection = await UserRepository.getCollection()
        const rawUser = await collection.findOne({ email })
        return rawUser && mapDocument(rawUser)
    }

    async getUserById(id: GetUserByIdRepository.Request): Promise<GetUserByIdRepository.Response> {
        const collection = await UserRepository.getCollection()
        const rawUser = await collection.findOne({ _id: stringToObjectId(id) })
        return rawUser && mapDocument(rawUser)
    }

    async updateUser(userData: UpdateUserRepository.Request): Promise<UpdateUserRepository.Response> {
        const collection = await UserRepository.getCollection()

        const { id } = userData

        const filter = { _id: stringToObjectId(id) }

        const result = await collection.updateOne(filter, { $set: userData })

        const rawUser = await collection.findOne(filter)
        console.log(rawUser)
        return rawUser && mapDocument(rawUser)
    }

    async getUsers(credentials: GetUsersRepository.Request): Promise<GetUsersRepository.Response> {
        const collection = await UserRepository.getCollection();
        const { page, paginationLimit } = credentials
        const limitNum = Number(paginationLimit)
        const offset = (page! - 1) * limitNum;

        const rawUsers = await collection.find({ deletedAt: null })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limitNum)
            .toArray()

        const users = mapCollection(rawUsers)

        const total = await collection.countDocuments({ deletedAt: null })
        const totalPages = Math.ceil(total / limitNum)
        return {
            data: users, page, total, totalPages,
        };
    }
}