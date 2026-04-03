import { WebrtcMiddleware } from '@infra/http/middlewares/authentication/WebrtcMiddleware';
import { BaseMiddleware } from '@infra/http/middlewares/BaseMiddleware';
import { makeAuthenticate } from '@main/factories/use-cases/authentication/authenticate-factory'; 
import { makeWebrtcAuthenticate } from '@main/factories/use-cases/authentication/webrtc-authenticate-factory';

export const makeWebrtcMiddleware = (): BaseMiddleware => {
  const authenticateUseCase = makeWebrtcAuthenticate()
  return new WebrtcMiddleware(authenticateUseCase)
};