export interface WebrtcVerifier {
    verify(secret: string): Promise<string | null>
}