export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
}

// Extiende Express Request para usar req.user
import 'express-serve-static-core';
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}
