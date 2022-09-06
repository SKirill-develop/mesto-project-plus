import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRoutes from './routes/users';
import cardsRoutes from './routes/cards';
import { ServerError } from './types/express';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from "./middlewares/logger";
import { errors, celebrate, Joi } from 'celebrate';
import cookieParser from 'cookie-parser';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string(),
  }),
}), createUser);

app.use(cookieParser())

app.use(auth);
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use(errorLogger);
app.use(errors());
app.use((err: ServerError, req: Request, res: Response) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
