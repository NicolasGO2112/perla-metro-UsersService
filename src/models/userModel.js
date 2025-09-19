import pool from '../config/db.js';

export const createUser = async (user) => {
  const query = `
    INSERT INTO users (id, nombre, apellido, email, password_hash, estado, fecha_registro)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING id, nombre, apellido, email, estado, fecha_registro;
  `;
  const values = [
    user.id,
    user.nombre,
    user.apellido,
    user.email,
    user.password_hash,
    true
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getUsers = async () => {
  const result = await pool.query(
    'SELECT id, nombre, apellido, email, estado, fecha_registro FROM users WHERE estado = true'
  );
  return result.rows;
};

export const getUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, nombre, apellido, email, estado, fecha_registro FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const softDeleteUser = async (id) => {
  await pool.query(
    'UPDATE users SET estado = false WHERE id = $1',
    [id]
  );
};
