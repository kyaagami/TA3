import { SignUpInterface } from "../../interfaces/use-cases/authentication/SignUpInterface";
import { GetUserByEmailRepository } from "../../interfaces/repositories/authentication/GetUserByEmailRepository";
import { HashComparer } from "../../interfaces/cryptography/HashComparer";
import { JWTGenerator } from "../../interfaces/cryptography/JWTGenerator";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { HashGenerator } from "@application/interfaces/cryptography/HashGenerator";
import { EmailInUseError } from "@application/errors/EmailInUseError";
import { CreateUserRepository } from "@application/interfaces/repositories/authentication/CreateUserRepository";


export class SignUp implements SignUpInterface {
    constructor(
        private readonly getUserByEmailRepository: GetUserByEmailRepository,
        private readonly hashGenerator: HashGenerator,
        // private readonly jwtGenerator: JWTGenerator,
        private readonly createUserRepository:CreateUserRepository,
    ) { }

    async execute(credentials: SignUpInterface.Request): Promise<SignUpInterface.Response> {
        const { email, username, password, name } = credentials

        const user = await this.getUserByEmailRepository.getUserByEmail(email)

        if (user) {
            return new EmailInUseError()
        }
        
        const passwordHash = await this.hashGenerator.hash(password)

        const newUserId = await this.createUserRepository.createUser({
            email: email,
            password: passwordHash,
            username: username,
            name: name,
            active: false,
        })

        return newUserId
    }
}