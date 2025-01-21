import { Request, Response, NextFunction } from 'express';
import IUser from '../types/user';
import OAuthService from '../services/OAuthService';
import CustomError from '../errors/customError';
import { Provider } from '../types/enums';

const oauthService = new OAuthService();

const handleGitHubAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const githubUser = req.user as IUser;

    if (!githubUser) {
      throw new CustomError('User not found!', 400); // Maybe change latter the error handling
    }

    const { githubId, username, email, profileImage } = githubUser;

    const { user, accessToken, refreshToken } =
      await oauthService.processOAuthUser({
        providerId: githubId!,
        provider: Provider.GITHUB,
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

export { handleGitHubAuthCallback };
