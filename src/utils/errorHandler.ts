import { Request, Response, NextFunction } from 'express';

// Custom Error Classes
export class APIError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
  }
}

export class NotFoundError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 404, details);
  }
}

export class UnauthorizedError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 401, details);
  }
}

export class ForbiddenError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 403, details);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

 
  console.error('Error caught in handler:', err);

  const response = {
    status: 'error',
    message: err.message || 'Something went wrong',
    timestamp: new Date().toISOString(),
    path: req.path
  };

  if (err instanceof APIError) {
    res.status(err.status).json(response);
  } else {
    res.status(500).json({
      ...response,
      message: 'Internal Server Error'
    });
  }
};
