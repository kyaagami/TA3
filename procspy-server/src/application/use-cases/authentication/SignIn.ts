import { SignInInterface } from "../../interfaces/use-cases/authentication/SignInInterface";
import { GetUserByEmailRepository } from "../../interfaces/repositories/authentication/GetUserByEmailRepository";
import { HashComparer } from "../../interfaces/cryptography/HashComparer";
import { JWTGenerator } from "../../interfaces/cryptography/JWTGenerator";
import { UnauthorizedError } from "../../errors/UnauthorizedError";


export class SignIn implements SignInInterface {
    constructor(
        private readonly getUserByEmailRepository: GetUserByEmailRepository,
        private readonly hashComparer: HashComparer,
        private readonly jwtGenerator: JWTGenerator
    ) { }

    async execute(credentials: SignInInterface.Request): Promise<SignInInterface.Response> {
        const { email, password } = credentials

        const user = await this.getUserByEmailRepository.getUserByEmail(email)

        if (!user) {
            return new UnauthorizedError()
        }

        if(user.active === false){
            return new UnauthorizedError()
        }
        
        const isPasswordValid = await this.hashComparer.compare(password, user.password)

        if (!isPasswordValid) {
            return new UnauthorizedError()
        }

        return this.jwtGenerator.generate(user.id)
    }
}