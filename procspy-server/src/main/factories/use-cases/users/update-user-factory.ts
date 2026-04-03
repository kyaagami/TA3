import { UpdateUserInterface } from "@application/interfaces/use-cases/users/UpdateUserInterface";
import { UserRepository } from "../../../../infra/db/mongodb/repositories/UserRepository";
import { UpdateUser } from "@application/use-cases/users/UpdateUser";

export const makeUpdateUser = (): UpdateUserInterface => {
    const userRepository = new UserRepository()

    return new UpdateUser(userRepository, userRepository, userRepository)
}