import express from 'express';
import { celebrate, Joi } from 'celebrate';
import { method } from '../helpers/validator';

import {
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  getMe,
} from '../controllers/users';

const router = express.Router();

router.get('/', getUsers);
router.get('/me', getMe);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom(method, 'custom validation'),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateAvatar);

export default router;
