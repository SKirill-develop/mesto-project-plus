import express from 'express';
import {
  createCard,
  getCards,
  deleteCards,
  likeCard,
  dislikeCard,
} from '../controllers/cards';

const router = express.Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCards);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;
