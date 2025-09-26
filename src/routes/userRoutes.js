import express from 'express';
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  deleteUserController,
  updateUserController
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUserController);
router.get('/', getUsersController);
router.get('/:id', getUserByIdController);
router.delete('/:id', deleteUserController);
router.put('/:id', updateUserController);

export default router;
