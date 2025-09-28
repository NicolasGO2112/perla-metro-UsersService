import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { createUser, getUsers, getUserById, softDeleteUser, updateUser, getUserByEmail } from '../models/userModel.js';

// Esquema de validación con Joi
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

export const createUserController = async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, lastname, email, password } = req.body;

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

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

export const getUsersController = async (req, res) => {
  try {
    const { name, email, state } = req.query;

    // Llamamos al modelo pasándole los filtros
    const users = await getUsers({ name, email, state });
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

export const updateUserController = async (req, res) => {
  try {
    const { error } = updateUserSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Validar unicidad de email solo si se intenta cambiar
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await getUserByEmail(req.body.email);
      if (existingUser) return res.status(400).json({ error: 'El correo ya está en uso por otro usuario' });
    }

    // Si viene password, hashearlo
    let password_hash = user.password_hash;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(req.body.password, salt);
    }

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
