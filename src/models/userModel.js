import pool from '../config/users-services-db.js';

export const createUser = async (user) => {
  const query = `
    INSERT INTO users (id, name, lastname, email, password_hash, state)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, name, lastname, email, state;
  `;
  const values = [
    user.id,
    user.name,
    user.lastname,
    user.email,
    user.password_hash,
    user.state
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getUsers = async () => {
  const result = await pool.query(
    'SELECT id, name, lastname, email, state FROM users WHERE state = true'
  );
  return result.rows;
};

export const getUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, lastname, email, state FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const softDeleteUser = async (id) => {
  await pool.query(
    'UPDATE users SET state = false WHERE id = $1',
    [id]
  );
};
