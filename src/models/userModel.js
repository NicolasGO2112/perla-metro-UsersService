import pool from '../config/users-services-db.js';

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
    "user",
    user.state,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

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
    values.push(filters.state === 'true'); // convertir a boolean
    conditions.push(`state = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  const result = await pool.query(query, values);
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

export const getUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

