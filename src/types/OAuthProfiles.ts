interface IOAuthUserProfile {
  googleId: string; // Google ID
  githubId?: string; // Github ID
  xId?: string; // X ID
  username: string; // User's name or login
  email?: string; // Optional email
  profileImage?: string; // Optional profile image URL
}

interface IGoogleProfile {
  id: string;
  displayName: string;
  emails?: { value: string; verified?: boolean }[];
  photos?: { value: string }[];
}

interface IGithubProfile {
  id: string;
  login: string;
  name: string;
  email?: string;
  avatar_url?: string;
}

interface IXProfile {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

export { IOAuthUserProfile, IGoogleProfile, IGithubProfile, IXProfile };
