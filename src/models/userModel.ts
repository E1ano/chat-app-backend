import moongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import IUser from '../types/user';

// eslint-disable-next-line @typescript-eslint/no-explicit-any , no-unused-vars
function isOAuthAbsent(): boolean {
  console.log('this', this);
  return !(this.googleId || this.githubId || this.xId);
}

const UserSchema = new Schema<IUser>(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      required: false, // Only availible for Google OAuth users
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
      required: false, // Only availible for GitHub OAuth users
    },
    xId: {
      type: String,
      unique: true,
      sparse: true,
      required: false, // Only availible for X OAuth users
    },
    username: {
      type: String,
      unique: true,
      required: [true, 'Username is required!'],
      minlength: 4,
      maxlength: 16,
    },
    password: {
      type: String,
      required: [isOAuthAbsent, 'Password is required!'],
      minlength: 6,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: [isOAuthAbsent, 'Email is required!'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
    },
    profileImage: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: 100,
    },
    countryCode: {
      type: String,
      match: /^\+\d{1,3}$/,
    },
    contactNumber: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^\d{10}$/, 'Contact number must be a valid 10-digit number!'],
    },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.comparePassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.plugin(uniqueValidator, { message: '{PATH} is already taken!' });

export const User = moongoose.model<IUser>('User', UserSchema);
