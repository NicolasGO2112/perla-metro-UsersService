import express from 'express';
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  deleteUserController
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUserController);
router.get('/', getUsersController);
router.get('/:id', getUserByIdController);
router.delete('/:id', deleteUserController);

export default router;
