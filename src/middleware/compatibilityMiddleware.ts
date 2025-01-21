import { Request, Response, NextFunction } from 'express';

export const sessionCompatibilityMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb: () => void) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb: () => void) => {
      cb();
    };
  }
  next();
};
