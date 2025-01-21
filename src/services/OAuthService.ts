import { User } from '../models/userModel';
import { Provider } from '../types/enums';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/tokenHelper';

class OAuthService {
  async processOAuthUser({
    providerId,
    provider,
    username,
    email,
    profileImage,
  }: {
    providerId: string;
    provider: Provider;
    username: string;
    email?: string;
    profileImage?: string;
  }) {
    // Check if the user exists based on the provider ID or email
    let user = await User.findOne({
      $or: [{ [`${provider}Id`]: providerId }, { email }],
    });

    if (!user) {
      // Create a new user if not found
      user = await User.create({
        [`${provider}Id`]: providerId,
        username,
        email,
        profileImage,
      });
    } else if (!user[`${provider}Id`]) {
      // Update the user with the provider ID if it's not already linked
      user[`${provider}Id`] = providerId;
      await user.save();
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user, accessToken, refreshToken };
  }
}

export default OAuthService;
