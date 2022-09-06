import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import InvalidDataError from '../errors/invalid-data-error';
import NotFoundError from '../errors/not-found-error';
import DoubleError from '../errors/double-error';
import AuthenticationError from '../errors/authentication-error';
import User from '../models/users';

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      })
        .then((user) => res.send(user))
        .catch((err) => {
          if (err.code === 11000) {
            next(new DoubleError('Пользователь с таким email уже существует'));
            return;
          }
          if (err.name === 'ValidationError') {
            next(new InvalidDataError('Переданы некорректные данные при создании пользователя'));
            return;
          }
          next(err);
        });
    })
    .catch((err) => next(err));
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
        return;
      }
      next(err);
    });
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Переданы некорректные данные при обновлении пользователя'));
        return;
      }
      next(err);
    });
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Переданы некорректные данные при обновлении аватара'));
        return;
      }
      next(err);
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new AuthenticationError('Неправильные почта или пароль'));
        return;
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new AuthenticationError('Неправильные почта или пароль'));
            return;
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

          res.cookie('jwtToken', token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: true,
          });
          res.send({ user });
        });
    })
    .catch((err) => {
      next(err);
    });
};

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
        return;
      }
      next(err);
    });
};
