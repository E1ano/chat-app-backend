import express from 'express';
import passport from 'passport';
import { handleGoogleAuthCallback } from '../controllers/googleAuthController';

const router = express.Router();

// Route for Google login
router
  .route('/')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] })); // Google scope

  // Route for Google OAuth callback
router
  .route('/callback')
  .get(
    passport.authenticate('google', { failureRedirect: '/login' }), // Handle failure
    handleGoogleAuthCallback, // Handle success
  );

export default router;
