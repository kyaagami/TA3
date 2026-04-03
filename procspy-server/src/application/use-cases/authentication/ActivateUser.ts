import { EmailInUseError } from "@application/errors/EmailInUseError"
import { UserNotExistError } from "@application/errors/UserNotExistError"
import { GetUserByEmailRepository } from "@application/interfaces/repositories/authentication/GetUserByEmailRepository"
import { GetUserByIdRepository } from "@application/interfaces/repositories/users/GetUserByIdRepository"
import { UpdateUserRepository } from "@application/interfaces/repositories/users/UpdateUserRepository"
import { ActivateUserInterface } from "@application/interfaces/use-cases/authentication/ActivateUserInterface"

export class ActivateUser implements ActivateUserInterface {
    constructor(
        private readonly getUserByIdRepository: GetUserByIdRepository,
        private readonly updateUserRepository: UpdateUserRepository,
    ) { }

    async execute(credentials: ActivateUserInterface.Request): Promise<ActivateUserInterface.Response> {
        const id = credentials
        
        const user = await this.getUserByIdRepository.getUserById(id)

        if(!user){
            return new UserNotExistError()
        }

        const updatedUser = await this.updateUserRepository.updateUser({ id, active: user.active ? false : true, updatedAt: (new Date).toISOString()})

        if (!updatedUser) {
            return new UserNotExistError()
        }
        return updatedUser

    }
}