
import { WebrtcVerifier } from "../../application/interfaces/cryptography/WebrtcVerifier";


export class WebrtcSecretAdapter implements WebrtcVerifier {
    constructor(private readonly secret: string) {}

    async verify(secret: string): Promise<string | null> {
        try {
            return secret === this.secret ? "ok" : null
        } catch (error){
            return null
        }

    }
}