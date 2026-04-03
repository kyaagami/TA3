import { ForbiddenError } from '@application/errors/ForbiddenError';
import { WebrtcVerifier } from '@application/interfaces/cryptography/WebrtcVerifier';
import { WebrtcAuthenticateInterface } from '@application/interfaces/use-cases/authentication/WebrtcAuthenticateInterface';

export class WebrtcAuthenticate implements WebrtcAuthenticateInterface {
  constructor(
    private readonly webrtcVerifier: WebrtcVerifier,
  ) {}

  async execute(
    authenticationToken: WebrtcAuthenticateInterface.Request,
  ): Promise<WebrtcAuthenticateInterface.Response> {
    const decodedToken = await this.webrtcVerifier.verify(authenticationToken)
    if (!decodedToken) {
      return new ForbiddenError()
    }
    return decodedToken
  }
}