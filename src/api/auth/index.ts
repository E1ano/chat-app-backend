import express from 'express';
import {
  loginUser,
  registerUser,
  refreshToken,
} from '../../controllers/authController.js';
import googleOAuthRoutes from '../auth/googleOAuth.js';
import githubOAuthRoutes from '../auth/githubOAuth.js';

const router = express.Router();

// OAuth-specific routes
router.use('/google', googleOAuthRoutes);
router.use('/github', githubOAuthRoutes);
// router.use('/x', xAuthRoutes);

// Classic auth rotes
router.route('/login').post(loginUser);
router.route('/register').post(registerUser);
router.route('/refresh-token').post(refreshToken);

export default router;
