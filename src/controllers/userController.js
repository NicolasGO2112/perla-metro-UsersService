import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import { createUser, getUsers, getUserById, softDeleteUser } from '../models/userModel.js';

// Esquema de validación con Joi
const userSchema = Joi.object({
  nombre: Joi.string().min(3).required(),
  apellido: Joi.string().min(3).required(),
  email: Joi.string().email().pattern(/@perlametro\.cl$/).required(),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/)    // al menos 1 mayúscula
    .pattern(/[a-z]/)    // al menos 1 minúscula
    .pattern(/[0-9]/)    // al menos 1 número
    .pattern(/[\W_]/)    // al menos 1 carácter especial
    .required(),
});

export const createUserController = async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { nombre, apellido, email, password } = req.body;

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await createUser({
      id: uuidv4(),
      nombre,
      apellido,
      email,
      password_hash
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsersController = async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    await softDeleteUser(req.params.id);
    res.json({ message: 'Usuario desactivado (soft delete)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
