import jwt from 'jsonwebtoken';
import IUser from '../types/user';

export const generateAccessToken = (payload: IUser): string => {
  return jwt.sign(
    {
      id: payload._id,
      username: payload.username,
    },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_LIFETIME,
    },
  );
};

export const generateRefreshToken = (payload: IUser): string => {
  return jwt.sign(
    {
      id: payload._id,
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_LIFETIME,
    },
  );
};
