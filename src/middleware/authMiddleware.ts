import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import CustomError from '../errors/customError.js';

interface CustomJwtPayload extends JwtPayload {
  id: string;
  username: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomError('Unauthorized: No token provided!', 401);
  }

  const token = authHeader?.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!,
    ) as CustomJwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new CustomError('Unauthorized: Token has expired!', 401);
    } else {
      console.error('JWT verification error:', error);
      throw new CustomError('Unauthorized: Invalid token!', 401);
    }
  }
};
