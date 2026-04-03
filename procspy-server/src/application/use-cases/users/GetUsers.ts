import { paginationConfig } from "@application/config/pagination"
import { EmailInUseError } from "@application/errors/EmailInUseError"
import { UserNotExistError } from "@application/errors/UserNotExistError"
import { GetUserByEmailRepository } from "@application/interfaces/repositories/authentication/GetUserByEmailRepository"
import { GetUsersRepository } from "@application/interfaces/repositories/users/GetUsersRepository"
import { GetUsersInterface } from "@application/interfaces/use-cases/users/GetUsersInterface"

export class GetUsers implements GetUsersInterface {
    constructor(
        private readonly getUsersRepository: GetUsersRepository,
    ) { }

    async execute(credentials: GetUsersInterface.Request): Promise<GetUsersInterface.Response> {
        const {page = 1, paginationLimit = paginationConfig.paginationLimit} = credentials

        const data = await this.getUsersRepository.getUsers({page, paginationLimit}) 
        return data
    }
}