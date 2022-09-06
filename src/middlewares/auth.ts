import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationError from '../errors/authentication-error';

export default (req: Request, res: Response, next: NextFunction) => {
  const { jwtToken } = req.cookies;
  if (!jwtToken) {
    next(new AuthenticationError('Необходима авторизация'));
    return;
  }

  let payload;
  try {
    payload = jwt.verify(jwtToken, 'some-secret-key');
  } catch (err) {
    next(new AuthenticationError('Неактуальный токен'));
    return;
  }

  req.user = { _id: payload };

  next();
};
