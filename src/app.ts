import express, { Request, Response } from 'express';
import passport from 'passport';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';

import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware.js';
import { sessionCompatibilityMiddleware } from './middleware/compatibilityMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import configurePassport from './config/passportConfig.js';

// Load environment variables from config.env
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    keys: [process.env.COOKIE_KEY!], // Set a cookie key in .env
  }),
);

app.use(sessionCompatibilityMiddleware); // Additional middleware to fix compatibility issue with regenerate function

// Debug: log environment variables
console.log('app.ts GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('app.ts GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
console.log('app.ts GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
console.log('app.ts COOKIE_KEY:', process.env.COOKIE_KEY);
console.log('app.ts PORT:', process.env.PORT);
console.log('app.ts DATABASE:', process.env.DATABASE);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
configurePassport();

// Routes
app.use('/api/v1/auth', authRoutes);

// Example route that throws a custom error
app.get('/api/v1/auth/google1', (req: Request, res: Response) => {
  res.send('google auth');
});

app.use(errorHandlerMiddleware);

export default app;
