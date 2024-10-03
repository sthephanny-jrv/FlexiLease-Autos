import { NextFunction, Request, Response } from 'express';
import AppError from '../errors/AppError';
import { verify } from 'jsonwebtoken';
import authConfig from 'src/api/config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token is missing', 'Bad request', 400);
  }

  // Ex.: Bearer asfklsfklehjfkledfjkewdfj
  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, authConfig.jwt.secret);

    const { sub } = decodedToken as ITokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT Token', 'Bad request', 400);
  }
}
