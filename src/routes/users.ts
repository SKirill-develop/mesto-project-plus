import express from 'express';
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
} from '../controllers/users';

const router = express.Router();

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
