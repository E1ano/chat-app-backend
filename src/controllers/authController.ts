import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/authService.js';

const authService = new AuthService();

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(
      email,
      password,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    res.status(200).json({ status: 'success', user, accessToken });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password, email } = req.body;
    const { user, accessToken, refreshToken } = await authService.registerUser(
      username,
      password,
      email,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    res.status(201).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { accessToken } = await authService.refreshToken(refreshToken);

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export { loginUser, registerUser, refreshToken };
