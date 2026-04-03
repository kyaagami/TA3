import { expressMiddlewareAdapter } from '@main/adapters/express-middleware-adapter';
import { makeAuthMiddleware } from '@main/factories/middlewares/authentication/auth-middleware-factory';

export const authMiddleware = expressMiddlewareAdapter(makeAuthMiddleware())