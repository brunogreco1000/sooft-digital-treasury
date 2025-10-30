// src/common/types/express-request.d.ts
import { Request, Response, NextFunction } from 'express';

interface JwtPayload {
  sub: string;
  username: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Ejemplo de middleware para usarlo
export const attachUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId: string = req.user.sub;
  next();
};
