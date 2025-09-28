import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro';

export const loginUser = async (req, res) => {
  try {
    // Validación del cuerpo de la solicitud
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

