import express from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createCard,
  getCards,
  deleteCards,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { method } from '../helpers/validator';

const router = express.Router();

const isValid = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(method, 'custom validation'),
  }),
})

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string(),
  }),
}), createCard);

router.delete('/:cardId', isValid, deleteCards);
router.put('/:cardId/likes', isValid, likeCard);
router.delete('/:cardId/likes', isValid, dislikeCard);

export default router;
