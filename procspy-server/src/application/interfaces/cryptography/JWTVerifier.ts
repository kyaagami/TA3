export interface JWTVerifier {
    verify(token: string): Promise<string | null>
}