import { EmailInUseError } from "@application/errors/EmailInUseError"
import { UserNotExistError } from "@application/errors/UserNotExistError"
import { GetUserByEmailRepository } from "@application/interfaces/repositories/authentication/GetUserByEmailRepository"
import { GetUserByIdRepository } from "@application/interfaces/repositories/users/GetUserByIdRepository"
import { UpdateUserRepository } from "@application/interfaces/repositories/users/UpdateUserRepository"
import { UpdateUserInterface } from "@application/interfaces/use-cases/users/UpdateUserInterface"

export class UpdateUser implements UpdateUserInterface {
    constructor(
        private readonly getUserByIdRepository: GetUserByIdRepository,
        private readonly getUserByEmailRepository: GetUserByEmailRepository,
        private readonly updateUserRepository: UpdateUserRepository,
    ) { }

    async execute(credentials: UpdateUserInterface.Request): Promise<UpdateUserInterface.Response> {
        const { id, email, name, username} = credentials
        
        const user = await this.getUserByIdRepository.getUserById(id)

        if(!user){
            return new UserNotExistError()
        }

        if(user.email !== email){
            const existEmail = await this.getUserByEmailRepository.getUserByEmail(email)

            if(existEmail){
                return new EmailInUseError()
            }
        }

        const updatedUser = await this.updateUserRepository.updateUser({ id, email, name , username,  updatedAt: (new Date).toISOString()})

        if (!updatedUser) {
            return new UserNotExistError()
        }
        const {password, ...newUpdatedUser} = updatedUser
        
        return newUpdatedUser

    }
}