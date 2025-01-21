import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/userModel.js';
import { IGoogleProfile } from '../types/OAuthProfiles.js';

const configureGoogleStrategy = (passport: typeof import('passport')) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const {
            id: googleId,
            displayName: username,
            emails,
            photos,
          }: IGoogleProfile = profile;
          const email = emails?.[0]?.value;
          const profileImage = photos?.[0]?.value;

          let user = await User.findOne({
            $or: [{ googleId }, { email }],
          });

          if (!user) {
            user = await User.create({
              googleId,
              username,
              email,
              profileImage,
            });
          } else {
            if (!user.googleId) {
              user.googleId = googleId;
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

export default configureGoogleStrategy;
