/**
 * Controladores para la gestión de usuarios.
 * Incluye creación, consulta, actualización y eliminación suave (soft delete).
 */

import { v4 as uuidv4 } from 'uuid'; // Generador de UUID para nuevos usuarios
import bcrypt from 'bcryptjs'; // Para hashear contraseñas
import Joi from 'joi'; // Para validación de esquemas
import { 
  createUser, 
  getUsers, 
  getUserById, 
  softDeleteUser, 
  updateUser, 
  getUserByEmail 
} from '../models/userModel.js';

// --------------------------
// Esquemas de validación
// --------------------------

/**
 * Esquema de validación para crear un usuario.
 * - name: mínimo 3 caracteres
 * - lastname: mínimo 3 caracteres
 * - email: debe terminar en @perlametro.cl
 * - password: mínimo 8 caracteres con mayúscula, minúscula, número y carácter especial
 */
const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  lastname: Joi.string().min(3).required(),
  email: Joi.string().email().pattern(/@perlametro\.cl$/).required(),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/)    // al menos 1 mayúscula
    .pattern(/[a-z]/)    // al menos 1 minúscula
    .pattern(/[0-9]/)    // al menos 1 número
    .pattern(/[\W_]/)    // al menos 1 carácter especial
    .required(),
});

/**
 * Esquema de validación para actualizar un usuario.
 * Todos los campos son opcionales pero se validan si se envían.
 */
const updateUserSchema = Joi.object({
  name: Joi.string().min(3),
  lastname: Joi.string().min(3),
  email: Joi.string().email().pattern(/@perlametro\.cl$/),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/)
    .pattern(/[a-z]/)
    .pattern(/[0-9]/)
    .pattern(/[\W_]/)
});

// --------------------------
// Controladores
// --------------------------

/**
 * Controlador para crear un nuevo usuario.
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 */
export const createUserController = async (req, res) => {
  try {
    // Validar datos de entrada
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, lastname, email, password } = req.body;

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Crear usuario en la base de datos
    const newUser = await createUser({
      id: uuidv4(),
      name,
      lastname,
      email,
      password_hash,
      state: true
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Controlador para obtener usuarios con filtros opcionales.
 */
export const getUsersController = async (req, res) => {
  try {
    const { name, email, state } = req.query;
    const users = await getUsers({ name, email, state });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Controlador para obtener un usuario por su ID.
 */
export const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Controlador para eliminar un usuario (soft delete).
 */
export const deleteUserController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    await softDeleteUser(req.params.id);
    res.json({ message: 'Usuario desactivado (soft delete)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Controlador para actualizar un usuario.
 * - Valida datos de entrada
 * - Verifica unicidad de email
 * - Hashea nueva contraseña si se envía
 */
export const updateUserController = async (req, res) => {
  try {
    const { error } = updateUserSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Verificar unicidad de email si se está cambiando
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await getUserByEmail(req.body.email);
      if (existingUser) return res.status(400).json({ error: 'El correo ya está en uso por otro usuario' });
    }

    // Hashear nueva contraseña si se envía
    let password_hash = user.password_hash;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(req.body.password, salt);
    }

    // Actualizar usuario en la base de datos
    const updatedUser = await updateUser(req.params.id, {
      name: req.body.name || user.name,
      lastname: req.body.lastname || user.lastname,
      email: req.body.email || user.email,
      password_hash
    });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
