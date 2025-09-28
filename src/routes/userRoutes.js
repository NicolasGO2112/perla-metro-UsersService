import express from 'express';
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  deleteUserController,
  updateUserController
} from '../controllers/userController.js';
import { loginUser } from '../controllers/authController.js';
import { authenticateJWT, checkAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createUserController);
router.get('/', getUsersController);
router.post('/login', loginUser);
router.get('/:id', getUserByIdController);
router.delete('/:id', deleteUserController);
router.put('/:id', updateUserController);

export default router;

