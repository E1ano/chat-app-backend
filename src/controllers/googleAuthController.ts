import { Request, Response, NextFunction } from 'express';
import IUser from '../types/user';
import OAuthService from '../services/OAuthService';
import { Provider } from '../types/enums';
import CustomError from '../errors/customError';

const oauthService = new OAuthService();

const handleGoogleAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const googleUser = req.user as IUser;

    if (!googleUser) {
      throw new CustomError('User not found!', 400); // Maybe change latter the error handling
    }

    const { googleId, username, email, profileImage } = googleUser;

    const { user, accessToken, refreshToken } =
      await oauthService.processOAuthUser({
        providerId: googleId!,
        provider: Provider.GOOGLE,
        username,
        email,
        profileImage,
      });

    // Set refresh token in a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    // Return user and access token
    res.status(200).json({
      status: 'success',
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export { handleGoogleAuthCallback };
