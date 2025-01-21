import express from 'express';
import {
  loginUser,
  registerUser,
  refreshToken,
} from '../controllers/authController.js';
import googleAuthRoutes from './googleAuthRoutes.js';
import githubAuthRoutes from './githubAuthRoutes.js';

const router = express.Router();

// OAuth-specific routes
router.use('/google', googleAuthRoutes);
router.use('/github', githubAuthRoutes);
// router.use('/x', xAuthRoutes);

// Classic auth rotes
router.route('/login').post(loginUser);
router.route('/register').post(registerUser);
router.route('/refresh-token').post(refreshToken);

export default router;
