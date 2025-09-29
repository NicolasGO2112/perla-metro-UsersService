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

/**
 * @route POST /users
 * @description Crea un nuevo usuario, se usa basicamente como un register
 * @access Público 
 */
router.post('/', createUserController);

/**
 * @route GET /users
 * @description Obtiene la lista de usuarios, con filtros opcionales
 * @access Puede requerir autenticación y rol admin según middleware(necesario en la api main)
 */
router.get('/', getUsersController);

/**
 * @route POST /users/login
 * @description Permite a un usuario iniciar sesión y obtener un token JWT
 * @access Público
 */
router.post('/login', loginUser);

/**
 * @route GET /users/:id
 * @description Obtiene la información de un usuario específico por ID
 * @access Puede requerir autenticación
 */
router.get('/:id', getUserByIdController);

/**
 * @route DELETE /users/:id
 * @description Realiza un "soft delete" de un usuario, desactivándolo
 * @access Puede requerir autenticación y rol admin(necesario en la api main)
 */
router.delete('/:id', deleteUserController);

/**
 * @route PUT /users/:id
 * @description Actualiza los datos de un usuario existente
 * @access Puede requerir autenticación 
 */
router.put('/:id', updateUserController);

export default router;
