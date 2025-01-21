import express from 'express';
import passport from 'passport';
import { handleGitHubAuthCallback } from '../controllers/githubAuthController';

const router = express.Router();

// Route for GitHub login
router
  .route('/')
  .get(passport.authenticate('github', { scope: ['user:email'] })); // GitHub scope

// Route for GitHub OAuth callback
router
  .route('/callback')
  .get(
    passport.authenticate('github', { failureRedirect: '/login' }), // Handle failures
    handleGitHubAuthCallback, // Handle success
  );

export default router;
