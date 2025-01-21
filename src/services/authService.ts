import jwt from 'jsonwebtoken';
import IUser from '../types/user';
import { User } from '../models/userModel';
import CustomError from '../errors/customError';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenHelper';

class AuthService {
  async loginUser(email: string, password: string) {
    if (!email || !password) {
      throw new CustomError('Please provide email and password!', 400);
    }

    const user = (await User.findOne({ email })) as IUser | null;

    if (!user) {
      throw new CustomError('Invalid credentials!', 404);
    }

    const passwordIsCorrect = await user.comparePassword(password);

    if (!passwordIsCorrect) {
      throw new CustomError('Wrong password!', 400);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user, accessToken, refreshToken };
  }

  async registerUser(username: string, password: string, email: string) {
    if (!username || !email || !password) {
      throw new CustomError('Please provide all required fields!', 400);
    }

    const existingUser = (await User.findOne({ email })) as IUser | null;
    if (existingUser) {
      throw new CustomError('User with this email already exists!', 400);
    }

    const createdUser = (await User.create({
      username,
      email,
      password,
    })) as unknown as IUser;

    const accessToken = generateAccessToken(createdUser);
    const refreshToken = generateRefreshToken(createdUser);

    const user = createdUser.toObject();
    delete user.password;
    delete user.profileImage;

    return { user, accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new CustomError('Refresh token not found, login again!', 403);
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as { id: string };

      const user = (await User.findById(decoded.id)) as IUser;
      if (!user) {
        throw new CustomError('User not found, login again!', 403);
      }

      const newAccessToken = generateAccessToken(user);

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new CustomError('Invalid refresh token!', 403);
    }
  }
}

export default AuthService;
