import { Request, Response, NextFunction } from 'express';
import CustomError from '../errors/customError.js';
import mongoose from 'mongoose';

export const errorHandlerMiddleware = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(err);
  // Check if the error is a Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((el) => el.message);
    res.status(400).json({
      status: 'fail',
      message: errors.join(', '), // Concatenate all validation error messages
    });
    return;
  }

  // If the error is an instance of CustomError, use its status code
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ status: 'fail', message: err.message });
    return;
  }

  // For other errors, return a 500 status code
  res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
  return;
};
