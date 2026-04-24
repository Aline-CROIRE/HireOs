import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error Handler]:', err.stack);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    status,
    message,
    // Only show stack trace in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};