import { GetUsersInterface } from "@application/interfaces/use-cases/users/GetUsersInterface"
import { GetUsers } from "@application/use-cases/users/GetUsers"
import { UserRepository } from "@infra/db/mongodb/repositories/UserRepository"

export const makeGetUsers = (): GetUsersInterface => {
    const userRepository = new UserRepository()

    return new GetUsers(userRepository)
}