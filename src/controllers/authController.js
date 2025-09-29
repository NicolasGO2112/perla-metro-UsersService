/**
 * Módulo de autenticación de usuarios.
 * Permite iniciar sesión validando credenciales y generando un JWT.
 */

import bcrypt from 'bcryptjs'; // Librería para hashear y comparar contraseñas
import jwt from 'jsonwebtoken'; // Librería para generar tokens JWT
import { getUserByEmail } from '../models/userModel.js'; // Función para obtener un usuario por email desde la base de datos

// Se obtiene la clave secreta para JWT desde variables de entorno o se utiliza una por defecto
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-here-minimum-32-characters-long';

/**
 * Controlador para login de usuario.
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 * 
 * Flujo:
 * 1. Verifica que se envíe email y contraseña.
 * 2. Busca el usuario por email en la base de datos.
 * 3. Compara la contraseña ingresada con la almacenada.
 * 4. Si es correcta, genera un token JWT con id, email y role.
 * 5. Devuelve el token al cliente.
 * 6. Maneja errores de validación, autenticación y servidor.
 */
export const loginUser = async (req, res) => {
  try {
    // Validación de datos requeridos en el body
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const { email, password } = req.body;

    // Obtener usuario de la base de datos
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Comparar contraseña enviada con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token JWT con datos del usuario
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' } // Token válido por 2 horas
    );

    // Enviar token al cliente
    res.json({ token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
