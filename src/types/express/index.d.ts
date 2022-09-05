import express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: Record<string>
    }
  }
}

export interface ServerError extends Error {
  statusCode: number;
}