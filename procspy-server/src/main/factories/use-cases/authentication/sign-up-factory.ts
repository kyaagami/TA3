import { SignUp } from "@application/use-cases/authentication/SignUp";
import { SignInInterface } from "../../../../application/interfaces/use-cases/authentication/SignInInterface";
import { SignIn } from "../../../../application/use-cases/authentication/SignIn";
import { BcryptAdapter } from "../../../../infra/cryptography/BcryptAdapter";
import { JWTAdapter } from "../../../../infra/cryptography/JWTAdapter";
import { UserRepository } from "../../../../infra/db/mongodb/repositories/UserRepository";
import env from "../../../config/env";

export const makeSignUp = (): SignInInterface => {
    const userRepository = new UserRepository()
    const bcryptAdapter = new BcryptAdapter(env.bcryptSalt)
    const createUserRepository = new UserRepository()

    return new SignUp(userRepository, bcryptAdapter, createUserRepository)
}