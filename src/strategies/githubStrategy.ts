import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import { User } from '../models/userModel.js';
import { IGithubProfile } from '../types/OAuthProfiles.js';
import { VerifyCallback } from 'passport-google-oauth20';

const configureGitHubStrategy = (passport: typeof import('passport')) => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: process.env.GITHUB_CALLBACK_URL!,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile & { _json: IGithubProfile },
        done: VerifyCallback,
      ) => {
        try {
          console.log('GitHub profile:', profile);
          const {
            id: githubId,
            login: username,
            email,
            avatar_url: profileImage,
          } = profile._json;
          console.log(
            'GitHub fields:',
            githubId,
            username,
            email,
            profileImage,
          );

          // Find the user by GitHub ID or email
          let user = await User.findOne({
            $or: [{ githubId }, { email }],
          });

          if (!user) {
            // Create a new user if not found
            user = await User.create({
              githubId,
              username,
              email,
              profileImage,
            });
          } else {
            // Update existing user if GitHub ID isn't linked yet
            if (!user.githubId) {
              user.githubId = githubId;
              await user.save();
            }
          }

          done(null, user);
        } catch (error) {
          done(error, undefined);
        }
      },
    ),
  );
};

export default configureGitHubStrategy;
