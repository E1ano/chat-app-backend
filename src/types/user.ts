import { Document } from 'mongoose';

interface IUser extends Document {
  _id: string;
  googleId?: string;
  githubId?: string;
  xId?: string;
  username: string;
  password?: string; // OAuth users won't have a password
  email?: string; // Some OAuth providers may not supply an email
  profileImage?: string;
  bio?: string;
  countryCode?: string;
  contactNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

export default IUser;
