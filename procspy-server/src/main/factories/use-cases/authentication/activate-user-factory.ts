import { ActivateUserInterface } from "../../../../application/interfaces/use-cases/authentication/ActivateUserInterface";
import { ActivateUser } from "../../../../application/use-cases/authentication/ActivateUser";
import { UserRepository } from "../../../../infra/db/mongodb/repositories/UserRepository";

export const makeActivateUser = (): ActivateUserInterface => {
    const userRepository = new UserRepository()

    return new ActivateUser(userRepository, userRepository)
}