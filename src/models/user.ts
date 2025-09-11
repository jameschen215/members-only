import { pool } from '../db/pool.js';
import { PublicUserType, UserType } from '../types/user.js';

export async function getAllUsers(q: string = ''): Promise<PublicUserType[]> {
  const queryParams = [];
  let query = `
    SELECT id, first_name, last_name, username, role, created_at, updated_at
    FROM users
  `;

  if (q) {
    query += `
      WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR username ILIKE $1
    `;
    queryParams.push(`%${q}%`);
  }

  query += 'ORDER BY created_at DESC;';

  const { rows } = await pool.query(query, queryParams);

  const users: PublicUserType[] = rows.map((user) => ({
    ...user,
    avatar: user.first_name.charAt(0) + user.last_name.charAt(0),
  }));

  return users;
}

export async function getUserByUsername(
  username: string,
): Promise<UserType | null> {
  const { rows } = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);

  return rows[0] || null;
}

export async function getUserById(id: number): Promise<UserType | null> {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

  return rows[0] || null;
}

export async function createUser(
  firstName: string,
  lastName: string,
  username: string,
  hashedPassword: string,
): Promise<UserType> {
  const { rows } = await pool.query(
    `INSERT INTO users (first_name, last_name, username, password)
    VALUES ($1, $2, $3, $4) RETURNING *`,
    [firstName, lastName, username, hashedPassword],
  );

  return rows[0];
}

export async function upgradeUserRole(
  user: PublicUserType,
): Promise<UserType | null> {
  if (user.role !== 'user') {
    return null;
  }

  const { rows } = await pool.query(
    `UPDATE users SET role = $1 WHERE id = $2 RETURNING *;`,
    ['moderator', user.id],
  );

  return rows[0];
}
