import pool from '../config/users-services-db.js';

/**
 * Crea un nuevo usuario en la base de datos.
 * @param {Object} user - Objeto con los datos del usuario.
 * @param {string} user.id - UUID del usuario.
 * @param {string} user.name - Nombre del usuario.
 * @param {string} user.lastname - Apellido del usuario.
 * @param {string} user.email - Email del usuario.
 * @param {string} user.password_hash - Contraseña hasheada del usuario.
 * @param {boolean} user.state - Estado activo/inactivo del usuario.
 * @returns {Promise<Object>} - Datos del usuario creado (sin contraseña).
 */
export const createUser = async (user) => {
  const query = `
    INSERT INTO users (id, name, lastname, email, password_hash, role, state, registered_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    RETURNING id, name, lastname, email, state;
  `;
  const values = [
    user.id,
    user.name,
    user.lastname,
    user.email,
    user.password_hash,
    "user", // Rol por defecto
    user.state,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Obtiene todos los usuarios con filtros opcionales.
 * @param {Object} [filters={}] - Filtros opcionales: name, email, state.
 * @returns {Promise<Array>} - Lista de usuarios que cumplen los filtros.
 */
export const getUsers = async (filters = {}) => {
  let query = 'SELECT id, name, lastname, email, state FROM users';
  const conditions = [];
  const values = [];

  if (filters.name) {
    values.push(`%${filters.name}%`);
    conditions.push(`(name ILIKE $${values.length} OR lastname ILIKE $${values.length})`);
  }

  if (filters.email) {
    values.push(`%${filters.email}%`);
    conditions.push(`email ILIKE $${values.length}`);
  }

  if (filters.state !== undefined) {
    values.push(filters.state === 'true'); // convertir string a boolean
    conditions.push(`state = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  const result = await pool.query(query, values);
  return result.rows;
};

/**
 * Obtiene un usuario por su ID.
 * @param {string} id - UUID del usuario.
 * @returns {Promise<Object|null>} - Usuario encontrado o null si no existe.
 */
export const getUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, lastname, email, state FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

/**
 * Desactiva un usuario (soft delete) sin eliminarlo de la base de datos.
 * @param {string} id - UUID del usuario.
 */
export const softDeleteUser = async (id) => {
  await pool.query(
    'UPDATE users SET state = false WHERE id = $1',
    [id]
  );
};

/**
 * Actualiza un usuario existente.
 * @param {string} id - UUID del usuario.
 * @param {Object} user - Datos del usuario a actualizar.
 * @param {string} user.name - Nombre actualizado.
 * @param {string} user.lastname - Apellido actualizado.
 * @param {string} user.email - Email actualizado.
 * @param {string} user.password_hash - Contraseña hasheada actualizada.
 * @returns {Promise<Object>} - Usuario actualizado (sin contraseña).
 */
export const updateUser = async (id, user) => {
  const query = `
    UPDATE users
    SET name = $1,
        lastname = $2,
        email = $3,
        password_hash = $4
    WHERE id = $5
    RETURNING name, lastname, email, state;
  `;
  const values = [
    user.name,
    user.lastname,
    user.email,
    user.password_hash,
    id
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Obtiene un usuario por su email.
 * @param {string} email - Email del usuario.
 * @returns {Promise<Object|null>} - Usuario encontrado o null si no existe.
 */
export const getUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};
