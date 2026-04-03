import { expressMiddlewareAdapter } from '@main/adapters/express-middleware-adapter';
import { makeAuthMiddleware } from '@main/factories/middlewares/authentication/auth-middleware-factory';
import { makeWebrtcMiddleware } from '@main/factories/middlewares/authentication/webrtc-middleware-factory';

export const webrtcMiddleware = expressMiddlewareAdapter(makeWebrtcMiddleware())