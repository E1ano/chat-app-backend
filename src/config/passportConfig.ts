import passport from 'passport';
import IUser from '../types/user.js';
import { User } from '../models/userModel.js';
import {
  configureGitHubStrategy,
  configureGoogleStrategy,
} from '../strategies/index.js';
// import configureXStrategy from '../strategies/xStrategy.js';

export default () => {
  configureGoogleStrategy(passport);
  configureGitHubStrategy(passport);
  //   configureXStrategy(passport);

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, (user as IUser)._id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, undefined);
    }
  });
};
